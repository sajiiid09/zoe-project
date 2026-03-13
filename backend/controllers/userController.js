import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/authMiddleware.js';
import { clearAuthCookie, getJwtSecret, setAuthCookie } from '../utils/auth.js';

const TOKEN_EXPIRY = '7d';
const MAX_PAGINATION_LIMIT = 100;
const ADDRESS_DATA_FIELDS = ['fullName', 'line1', 'line2', 'city', 'state', 'zipCode', 'country', 'phone'];

const generateToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });
};

const toSafeAddressData = (payload = {}) => {
  return ADDRESS_DATA_FIELDS.reduce((data, field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }
    return data;
  }, {});
};

const formatUserResponse = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  profilePicture: user.profilePicture,
  role: user.role,
  vendorFeePaid: user.vendorFeePaid || false,
  affiliateFeePaid: user.affiliateFeePaid || false,
  preferences: user.preferences,
  addresses: user.addresses ?? [],
  store: user.store ?? null,
  affiliateProfile: user.affiliateProfile ?? null,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long',
    });
  }

  // Allow registering as VENDOR or AFFILIATE; default to CUSTOMER
  const validRoles = ['CUSTOMER', 'VENDOR', 'AFFILIATE'];
  const userRole = validRoles.includes(role) ? role : 'CUSTOMER';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'A user with this email already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: userRole,
      isActive: true,
      affiliateFeePaid: userRole === 'AFFILIATE' ? false : undefined,
      loginCount: 1,
      lastLogin: new Date(),
    },
    include: { addresses: true, store: true, affiliateProfile: true },
  });

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    user: formatUserResponse(user),
    message: 'Account created successfully',
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { addresses: true, store: true, affiliateProfile: true },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated',
    });
  }

  // Vendors must pay the registration fee before they can sign in
  if (user.role === 'VENDOR' && !user.vendorFeePaid) {
    // Still authenticate so the frontend can redirect to payment
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const tempToken = generateToken(user.id);
    setAuthCookie(res, tempToken);
    return res.status(402).json({
      success: false,
      requiresPayment: true,
      user: formatUserResponse(user),
      message: 'Vendor registration fee required. Please complete payment to access your account.',
    });
  }

  if (user.role === 'AFFILIATE' && !user.affiliateFeePaid) {
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const tempToken = generateToken(user.id);
    setAuthCookie(res, tempToken);
    return res.status(402).json({
      success: false,
      requiresPayment: true,
      user: formatUserResponse(user),
      message: 'Affiliate registration fee required. Please complete payment to access your account.',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      loginCount: { increment: 1 },
    },
  });

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  res.json({
    success: true,
    user: formatUserResponse(user),
    message: 'Login successful',
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const fullUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { addresses: true, store: true, affiliateProfile: true },
  });

  res.json({
    success: true,
    user: formatUserResponse(fullUser),
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, preferences } = req.body;

  const data = {};
  if (name) {
    data.firstName = name.firstName;
    data.lastName = name.lastName;
  }
  if (phone !== undefined) {
    data.phone = phone;
  }
  if (preferences) {
    data.preferences = {
      ...(req.user.preferences || {}),
      ...preferences,
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data,
    include: { addresses: true, affiliateProfile: true },
  });

  res.json({
    success: true,
    data: formatUserResponse(updatedUser),
    message: 'Profile updated successfully',
  });
});

export const addUserAddress = asyncHandler(async (req, res) => {
  const safeAddressData = toSafeAddressData(req.body);

  await prisma.userAddress.create({
    data: {
      userId: req.user.id,
      label: req.body.label || 'Other',
      type: req.body.type || 'shipping',
      phone: req.body.phone || null,
      isDefault: req.body.isDefault ?? false,
      data: safeAddressData,
    },
  });

  const addresses = await prisma.userAddress.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.status(201).json({
    success: true,
    data: addresses,
    message: 'Address added successfully',
  });
});

export const updateUserAddress = asyncHandler(async (req, res) => {
  const address = await prisma.userAddress.findUnique({
    where: { id: req.params.addressId },
  });

  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: 'Address not found',
    });
  }

  const existingAddressData =
    address.data && typeof address.data === 'object' && !Array.isArray(address.data)
      ? address.data
      : {};
  const safeAddressData = toSafeAddressData(req.body);

  await prisma.userAddress.update({
    where: { id: req.params.addressId },
    data: {
      label: req.body.label ?? address.label,
      type: req.body.type ?? address.type,
      phone: req.body.phone ?? address.phone,
      isDefault: req.body.isDefault ?? address.isDefault,
      data: {
        ...existingAddressData,
        ...safeAddressData,
      },
    },
  });

  const addresses = await prisma.userAddress.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: addresses,
    message: 'Address updated successfully',
  });
});

export const deleteUserAddress = asyncHandler(async (req, res) => {
  const address = await prisma.userAddress.findUnique({
    where: { id: req.params.addressId },
  });

  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: 'Address not found',
    });
  }

  await prisma.userAddress.delete({ where: { id: req.params.addressId } });

  const addresses = await prisma.userAddress.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: addresses,
    message: 'Address deleted successfully',
  });
});

export const getUserOrdersSummary = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const summary = await prisma.order.aggregate({
    where: { userId: req.user.id },
    _count: { _all: true },
    _sum: { total: true },
  });

  const [pendingOrders, completedOrders] = await Promise.all([
    prisma.order.count({ where: { userId: req.user.id, status: 'pending' } }),
    prisma.order.count({ where: { userId: req.user.id, status: 'delivered' } }),
  ]);

  res.json({
    success: true,
    data: {
      summary: {
        totalOrders: summary._count._all,
        totalSpent: summary._sum.total || 0,
        pendingOrders,
        completedOrders,
      },
      recentOrders: orders,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    role,
    search,
    isActive,
  } = req.query;

  const where = {};
  if (role) where.role = role === 'admin' ? 'ADMIN' : role === 'customer' ? 'CUSTOMER' : role === 'vendor' ? 'VENDOR' : role;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const parsedLimit = Number(limit);
  const safeLimit = Math.min(
    Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 20, 1),
    MAX_PAGINATION_LIMIT
  );
  const skip = (pageNumber - 1) * safeLimit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      include: { addresses: true, store: true },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users.map(formatUserResponse),
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / safeLimit) || 1,
      totalUsers: total,
      hasNext: skip + users.length < total,
      hasPrev: pageNumber > 1,
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: formatUserResponse(user),
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'role', 'isActive', 'preferences'];
    const data = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      include: { addresses: true },
    });

    res.json({
      success: true,
      data: formatUserResponse(user),
      message: 'User updated successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    throw error;
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    throw error;
  }
});

export const getUserStats = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  let startDate;

  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const [totalUsers, activeUsers, adminUsers, customerUsers, vendorUsers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: startDate } } }),
    prisma.user.count({ where: { createdAt: { gte: startDate }, isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: startDate }, role: 'ADMIN' } }),
    prisma.user.count({ where: { createdAt: { gte: startDate }, role: 'CUSTOMER' } }),
    prisma.user.count({ where: { createdAt: { gte: startDate }, role: 'VENDOR' } }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      adminUsers,
      customerUsers,
      vendorUsers,
    },
  });
});

/* ─── Admin vendor-management endpoints ─── */

/**
 * GET /api/users/admin/vendors – List vendors with their store info.
 */
export const getVendors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const parsedLimit = Number(limit);
  const safeLimit = Math.min(
    Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 20, 1),
    MAX_PAGINATION_LIMIT
  );
  const skip = (pageNumber - 1) * safeLimit;

  const where = { role: 'VENDOR' };

  const storeWhere = {};
  if (status) storeWhere.approvalStatus = status.toUpperCase();

  const [vendors, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            approvalStatus: true,
            rejectionNote: true,
            isActive: true,
            createdAt: true,
            _count: { select: { products: true } },
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: vendors,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / safeLimit) || 1,
      total,
      hasNext: skip + vendors.length < total,
      hasPrev: pageNumber > 1,
    },
  });
});

/**
 * PUT /api/users/admin/vendors/:storeId/approve – Approve a vendor's store.
 */
export const approveVendorStore = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { id: req.params.storeId },
  });

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const updated = await prisma.store.update({
    where: { id: req.params.storeId },
    data: { approvalStatus: 'APPROVED', isActive: true, rejectionNote: null },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Vendor store approved successfully',
  });
});

/**
 * PUT /api/users/admin/vendors/:storeId/reject – Reject a vendor's store.
 */
export const rejectVendorStore = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { id: req.params.storeId },
  });

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const updated = await prisma.store.update({
    where: { id: req.params.storeId },
    data: {
      approvalStatus: 'REJECTED',
      isActive: false,
      rejectionNote: req.body.reason || null,
    },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Vendor store rejected',
  });
});
