import { Prisma } from '@prisma/client';
import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/authMiddleware.js';

/* ─── helpers ─── */

const storeSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logo: true,
  banner: true,
  address: true,
  phone: true,
  email: true,
  approvalStatus: true,
  rejectionNote: true,
  isActive: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { products: true } },
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/* ─── store CRUD (vendor) ─── */

/**
 * POST /api/vendor/store – Create a store for the current vendor.
 * Each vendor may own exactly one store.
 */
export const createStore = asyncHandler(async (req, res) => {
  const existing = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'You already have a store',
    });
  }

  const { name, description, logo, banner, address, phone, email } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Store name is required',
    });
  }

  let slug = slugify(name);
  const slugExists = await prisma.store.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

  const store = await prisma.store.create({
    data: {
      name,
      slug,
      description: description || null,
      logo: logo || null,
      banner: banner || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      ownerId: req.user.id,
      approvalStatus: 'PENDING',
    },
    select: storeSelect,
  });

  res.status(201).json({
    success: true,
    data: store,
    message: 'Store created – pending admin approval',
  });
});

/**
 * GET /api/vendor/store – Retrieve the current vendor's store.
 */
export const getMyStore = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
    select: storeSelect,
  });

  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'You have not created a store yet',
    });
  }

  res.json({ success: true, data: store });
});

/**
 * PUT /api/vendor/store – Update the current vendor's store.
 */
export const updateMyStore = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'Store not found',
    });
  }

  const { name, description, logo, banner, address, phone, email } = req.body;

  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (logo !== undefined) data.logo = logo;
  if (banner !== undefined) data.banner = banner;
  if (address !== undefined) data.address = address;
  if (phone !== undefined) data.phone = phone;
  if (email !== undefined) data.email = email;

  const updated = await prisma.store.update({
    where: { id: store.id },
    data,
    select: storeSelect,
  });

  res.json({
    success: true,
    data: updated,
    message: 'Store updated successfully',
  });
});

/* ─── vendor product CRUD ─── */

const productInclude = {
  reviews: {
    include: {
      user: {
        select: { id: true, email: true, firstName: true, lastName: true, profilePicture: true },
      },
    },
  },
  store: {
    select: { id: true, name: true, slug: true, logo: true },
  },
};

/**
 * GET /api/vendor/products – List products belonging to my store.
 */
export const getMyProducts = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'You have not created a store yet',
    });
  }

  const { page = 1, limit = 20, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { storeId: store.id };
  if (status) where.approvalStatus = status.toUpperCase();

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      totalProducts: total,
      hasNext: skip + products.length < total,
      hasPrev: Number(page) > 1,
    },
  });
});

/**
 * POST /api/vendor/products – Create a product (pending approval).
 */
export const createVendorProduct = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'You must create a store first',
    });
  }

  if (store.approvalStatus !== 'APPROVED') {
    return res.status(403).json({
      success: false,
      message: 'Your store must be approved before you can add products',
    });
  }

  const { name, description, category, price, stock, images } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Product name and price are required',
    });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      category: category || null,
      price: new Prisma.Decimal(price),
      stock: Number(stock ?? 0),
      images: images ?? [],
      isActive: true,
      isFeatured: false,
      approvalStatus: 'PENDING',
      storeId: store.id,
    },
    include: productInclude,
  });

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created – pending admin approval',
  });
});

/**
 * PUT /api/vendor/products/:id – Update own product.
 */
export const updateVendorProduct = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product || product.storeId !== store.id) {
    return res.status(404).json({
      success: false,
      message: 'Product not found in your store',
    });
  }

  const data = { ...req.body };
  if (data.price !== undefined) data.price = new Prisma.Decimal(data.price);
  if (data.stock !== undefined) data.stock = Number(data.stock);

  // Vendors cannot self-approve or set featured
  delete data.approvalStatus;
  delete data.isFeatured;
  delete data.storeId;

  const updated = await prisma.product.update({
    where: { id: req.params.id },
    data,
    include: productInclude,
  });

  res.json({
    success: true,
    data: updated,
    message: 'Product updated successfully',
  });
});

/**
 * DELETE /api/vendor/products/:id – Delete own product.
 */
export const deleteVendorProduct = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
  });

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product || product.storeId !== store.id) {
    return res.status(404).json({
      success: false,
      message: 'Product not found in your store',
    });
  }

  await prisma.product.delete({ where: { id: req.params.id } });

  res.json({ success: true, message: 'Product deleted successfully' });
});

/**
 * GET /api/vendor/dashboard – Aggregated stats for vendor dashboard.
 */
export const getVendorDashboard = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
    select: { id: true, name: true, approvalStatus: true },
  });

  if (!store) {
    return res.json({
      success: true,
      data: { hasStore: false },
    });
  }

  const [totalProducts, pendingProducts, approvedProducts, rejectedProducts] =
    await Promise.all([
      prisma.product.count({ where: { storeId: store.id } }),
      prisma.product.count({ where: { storeId: store.id, approvalStatus: 'PENDING' } }),
      prisma.product.count({ where: { storeId: store.id, approvalStatus: 'APPROVED' } }),
      prisma.product.count({ where: { storeId: store.id, approvalStatus: 'REJECTED' } }),
    ]);

  // Count orders that contain products from this store
  const orderItems = await prisma.orderItem.findMany({
    where: { product: { storeId: store.id } },
    select: { orderId: true, total: true },
  });

  const uniqueOrderIds = [...new Set(orderItems.map((oi) => oi.orderId))];
  const totalRevenue = orderItems.reduce(
    (sum, oi) => sum + Number(oi.total),
    0
  );

  res.json({
    success: true,
    data: {
      hasStore: true,
      store,
      stats: {
        totalProducts,
        pendingProducts,
        approvedProducts,
        rejectedProducts,
        totalOrders: uniqueOrderIds.length,
        totalRevenue,
      },
    },
  });
});
