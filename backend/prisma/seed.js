import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

if (process.env.DIRECT_URL) {
  // Supabase pooler can fail with prepared statement conflicts during seed runs.
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const prisma = new PrismaClient();

const SEED_IDS = {
  store: "seed_store_vendor_primary",
  products: {
    approved: "seed_product_vendor_approved",
    pending: "seed_product_vendor_pending",
    featured: "seed_product_admin_featured",
  },
  affiliateProfile: "seed_affiliate_profile_primary",
  submission: "seed_submission_vendor_primary",
  catalog: {
    fromSubmission: "seed_catalog_from_submission",
    adminOnly: "seed_catalog_admin_only",
  },
  addresses: {
    home: "seed_address_customer_home",
    office: "seed_address_customer_office",
  },
  order: "seed_order_customer_001",
  orderItems: {
    approvedProduct: "seed_order_item_approved_product",
    featuredProduct: "seed_order_item_featured_product",
  },
};

const decimal = (value) => new Prisma.Decimal(value);

const seedUsers = async (hashedPassword) => {
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
      vendorFeePaid: false,
      affiliateFeePaid: false,
    },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
      loginCount: 1,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {
      password: hashedPassword,
      firstName: "Customer",
      lastName: "User",
      role: "CUSTOMER",
      isActive: true,
      vendorFeePaid: false,
      affiliateFeePaid: false,
    },
    create: {
      email: "customer@example.com",
      password: hashedPassword,
      firstName: "Customer",
      lastName: "User",
      role: "CUSTOMER",
      isActive: true,
      loginCount: 1,
    },
  });

  const vendor = await prisma.user.upsert({
    where: { email: "vendor@example.com" },
    update: {
      password: hashedPassword,
      firstName: "Vendor",
      lastName: "Seller",
      role: "VENDOR",
      isActive: true,
      vendorFeePaid: true,
      affiliateFeePaid: false,
    },
    create: {
      email: "vendor@example.com",
      password: hashedPassword,
      firstName: "Vendor",
      lastName: "Seller",
      role: "VENDOR",
      isActive: true,
      vendorFeePaid: true,
      loginCount: 1,
    },
  });

  const affiliate = await prisma.user.upsert({
    where: { email: "affiliate@example.com" },
    update: {
      password: hashedPassword,
      firstName: "Affiliate",
      lastName: "Partner",
      role: "AFFILIATE",
      isActive: true,
      vendorFeePaid: false,
      affiliateFeePaid: true,
    },
    create: {
      email: "affiliate@example.com",
      password: hashedPassword,
      firstName: "Affiliate",
      lastName: "Partner",
      role: "AFFILIATE",
      isActive: true,
      affiliateFeePaid: true,
      loginCount: 1,
    },
  });

  return { admin, customer, vendor, affiliate };
};

const seedStore = async (vendorId) =>
  prisma.store.upsert({
    where: { ownerId: vendorId },
    update: {
      name: "Decor Store",
      slug: "decor-store",
      description: "Approved vendor store for verification flows",
      email: "support@decorstore.example",
      approvalStatus: "APPROVED",
      isActive: true,
      rejectionNote: null,
    },
    create: {
      id: SEED_IDS.store,
      ownerId: vendorId,
      name: "Decor Store",
      slug: "decor-store",
      description: "Approved vendor store for verification flows",
      email: "support@decorstore.example",
      approvalStatus: "APPROVED",
      isActive: true,
    },
  });

const seedAffiliateProfile = async (affiliateUserId) =>
  prisma.affiliateProfile.upsert({
    where: { userId: affiliateUserId },
    update: {
      displayName: "Design Guru",
      referralCode: "DESIGNGURU",
      bio: "Interior inspiration and curated decor finds.",
      website: "https://instagram.com/designguru",
      payoutEmail: "affiliate@example.com",
      approvalStatus: "APPROVED",
      isActive: true,
      rejectionNote: null,
    },
    create: {
      id: SEED_IDS.affiliateProfile,
      userId: affiliateUserId,
      displayName: "Design Guru",
      referralCode: "DESIGNGURU",
      bio: "Interior inspiration and curated decor finds.",
      website: "https://instagram.com/designguru",
      payoutEmail: "affiliate@example.com",
      approvalStatus: "APPROVED",
      isActive: true,
      commissionRate: decimal(0.08),
    },
  });

const seedProducts = async ({ storeId }) => {
  const approvedProduct = await prisma.product.upsert({
    where: { id: SEED_IDS.products.approved },
    update: {
      name: "Nordic Ceramic Vase",
      description: "Minimal handcrafted vase for modern interiors.",
      category: "home",
      price: decimal(59.99),
      stock: 45,
      images: [
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: false,
      approvalStatus: "APPROVED",
      rejectionNote: null,
      storeId,
    },
    create: {
      id: SEED_IDS.products.approved,
      name: "Nordic Ceramic Vase",
      description: "Minimal handcrafted vase for modern interiors.",
      category: "home",
      price: decimal(59.99),
      stock: 45,
      images: [
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: false,
      approvalStatus: "APPROVED",
      storeId,
    },
  });

  const pendingProduct = await prisma.product.upsert({
    where: { id: SEED_IDS.products.pending },
    update: {
      name: "Pending Artisan Wall Mirror",
      description: "Vendor-submitted mirror waiting for admin approval.",
      category: "home",
      price: decimal(129.0),
      stock: 20,
      images: [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: false,
      approvalStatus: "PENDING",
      rejectionNote: null,
      storeId,
    },
    create: {
      id: SEED_IDS.products.pending,
      name: "Pending Artisan Wall Mirror",
      description: "Vendor-submitted mirror waiting for admin approval.",
      category: "home",
      price: decimal(129.0),
      stock: 20,
      images: [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: false,
      approvalStatus: "PENDING",
      storeId,
    },
  });

  const featuredProduct = await prisma.product.upsert({
    where: { id: SEED_IDS.products.featured },
    update: {
      name: "Signature Table Lamp",
      description: "Admin-curated featured product.",
      category: "home",
      price: decimal(89.5),
      stock: 35,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: true,
      approvalStatus: "APPROVED",
      rejectionNote: null,
      storeId: null,
    },
    create: {
      id: SEED_IDS.products.featured,
      name: "Signature Table Lamp",
      description: "Admin-curated featured product.",
      category: "home",
      price: decimal(89.5),
      stock: 35,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80",
      ],
      isActive: true,
      isFeatured: true,
      approvalStatus: "APPROVED",
    },
  });

  return { approvedProduct, pendingProduct, featuredProduct };
};

const seedSubmissionAndCatalog = async ({
  adminId,
  vendorId,
  storeId,
}) => {
  const submission = await prisma.vendorSubmission.upsert({
    where: { id: SEED_IDS.submission },
    update: {
      vendorId,
      storeId,
      title: "Handwoven Storage Basket",
      description: "Eco-friendly basket set for storage and decor.",
      category: "home",
      vendorQuotedPrice: decimal(22.5),
      suggestedRetailPrice: decimal(39.99),
      currency: "usd",
      stockAvailable: 120,
      images: [
        "https://images.unsplash.com/photo-1616628182509-6b8f42f10656?w=800&h=1000&fit=crop&q=80",
      ],
      status: "SUBMITTED",
      rejectionReason: null,
      reviewedAt: null,
      reviewedById: null,
    },
    create: {
      id: SEED_IDS.submission,
      vendorId,
      storeId,
      title: "Handwoven Storage Basket",
      description: "Eco-friendly basket set for storage and decor.",
      category: "home",
      vendorQuotedPrice: decimal(22.5),
      suggestedRetailPrice: decimal(39.99),
      currency: "usd",
      stockAvailable: 120,
      images: [
        "https://images.unsplash.com/photo-1616628182509-6b8f42f10656?w=800&h=1000&fit=crop&q=80",
      ],
      status: "SUBMITTED",
    },
  });

  await prisma.catalogProduct.upsert({
    where: { id: SEED_IDS.catalog.fromSubmission },
    update: {
      title: "Handwoven Storage Basket",
      description: "Approved catalog listing from vendor submission.",
      category: "home",
      retailPrice: decimal(39.99),
      currency: "usd",
      stock: 120,
      images: [
        "https://images.unsplash.com/photo-1616628182509-6b8f42f10656?w=800&h=1000&fit=crop&q=80",
      ],
      status: "ACTIVE",
      isFeatured: false,
      isCommissionable: true,
      sourceSubmissionId: submission.id,
      supplierVendorId: vendorId,
      createdByAdminId: adminId,
    },
    create: {
      id: SEED_IDS.catalog.fromSubmission,
      title: "Handwoven Storage Basket",
      description: "Approved catalog listing from vendor submission.",
      category: "home",
      retailPrice: decimal(39.99),
      currency: "usd",
      stock: 120,
      images: [
        "https://images.unsplash.com/photo-1616628182509-6b8f42f10656?w=800&h=1000&fit=crop&q=80",
      ],
      status: "ACTIVE",
      isFeatured: false,
      isCommissionable: true,
      sourceSubmissionId: submission.id,
      supplierVendorId: vendorId,
      createdByAdminId: adminId,
    },
  });

  await prisma.catalogProduct.upsert({
    where: { id: SEED_IDS.catalog.adminOnly },
    update: {
      title: "Premium Marble Clock",
      description: "Admin-managed catalog product.",
      category: "home",
      retailPrice: decimal(74.0),
      currency: "usd",
      stock: 55,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=1000&fit=crop&q=80",
      ],
      status: "ACTIVE",
      isFeatured: true,
      isCommissionable: true,
      sourceSubmissionId: null,
      supplierVendorId: null,
      createdByAdminId: adminId,
    },
    create: {
      id: SEED_IDS.catalog.adminOnly,
      title: "Premium Marble Clock",
      description: "Admin-managed catalog product.",
      category: "home",
      retailPrice: decimal(74.0),
      currency: "usd",
      stock: 55,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=1000&fit=crop&q=80",
      ],
      status: "ACTIVE",
      isFeatured: true,
      isCommissionable: true,
      createdByAdminId: adminId,
    },
  });
};

const seedAddressesAndOrder = async ({ customerId, approvedProductId, featuredProductId }) => {
  const homeAddressData = {
    fullName: "Customer User",
    line1: "123 Market Street",
    line2: "Apt 5B",
    city: "Dhaka",
    state: "Dhaka",
    zipCode: "1207",
    country: "Bangladesh",
    phone: "+8801712345678",
  };

  const officeAddressData = {
    fullName: "Customer User",
    line1: "44 Business Avenue",
    line2: "Floor 6",
    city: "Dhaka",
    state: "Dhaka",
    zipCode: "1212",
    country: "Bangladesh",
    phone: "+8801812345678",
  };

  await prisma.userAddress.upsert({
    where: { id: SEED_IDS.addresses.home },
    update: {
      userId: customerId,
      label: "Home",
      type: "shipping",
      phone: homeAddressData.phone,
      isDefault: true,
      data: homeAddressData,
    },
    create: {
      id: SEED_IDS.addresses.home,
      userId: customerId,
      label: "Home",
      type: "shipping",
      phone: homeAddressData.phone,
      isDefault: true,
      data: homeAddressData,
    },
  });

  await prisma.userAddress.upsert({
    where: { id: SEED_IDS.addresses.office },
    update: {
      userId: customerId,
      label: "Office",
      type: "shipping",
      phone: officeAddressData.phone,
      isDefault: false,
      data: officeAddressData,
    },
    create: {
      id: SEED_IDS.addresses.office,
      userId: customerId,
      label: "Office",
      type: "shipping",
      phone: officeAddressData.phone,
      isDefault: false,
      data: officeAddressData,
    },
  });

  await prisma.order.upsert({
    where: { id: SEED_IDS.order },
    update: {
      orderNumber: "ORD-SEED-0001",
      userId: customerId,
      status: "processing",
      paymentStatus: "pending",
      paymentMethod: "cod",
      shippingAddress: homeAddressData,
      billingAddress: homeAddressData,
      subtotal: decimal(209.48),
      shippingCost: decimal(0),
      tax: decimal(10.47),
      total: decimal(219.95),
      customerNote: "Seeded sample order",
      adminNote: null,
    },
    create: {
      id: SEED_IDS.order,
      orderNumber: "ORD-SEED-0001",
      userId: customerId,
      status: "processing",
      paymentStatus: "pending",
      paymentMethod: "cod",
      shippingAddress: homeAddressData,
      billingAddress: homeAddressData,
      subtotal: decimal(209.48),
      shippingCost: decimal(0),
      tax: decimal(10.47),
      total: decimal(219.95),
      customerNote: "Seeded sample order",
      adminNote: null,
    },
  });

  await prisma.orderItem.upsert({
    where: { id: SEED_IDS.orderItems.approvedProduct },
    update: {
      orderId: SEED_IDS.order,
      productId: approvedProductId,
      quantity: 2,
      price: decimal(59.99),
      total: decimal(119.98),
    },
    create: {
      id: SEED_IDS.orderItems.approvedProduct,
      orderId: SEED_IDS.order,
      productId: approvedProductId,
      quantity: 2,
      price: decimal(59.99),
      total: decimal(119.98),
    },
  });

  await prisma.orderItem.upsert({
    where: { id: SEED_IDS.orderItems.featuredProduct },
    update: {
      orderId: SEED_IDS.order,
      productId: featuredProductId,
      quantity: 1,
      price: decimal(89.5),
      total: decimal(89.5),
    },
    create: {
      id: SEED_IDS.orderItems.featuredProduct,
      orderId: SEED_IDS.order,
      productId: featuredProductId,
      quantity: 1,
      price: decimal(89.5),
      total: decimal(89.5),
    },
  });
};

async function main() {
  console.log("Starting idempotent seed...");

  const hashedPassword = await bcrypt.hash("password123", 12);
  const users = await seedUsers(hashedPassword);
  console.log("Users seeded:", {
    admin: users.admin.email,
    customer: users.customer.email,
    vendor: users.vendor.email,
    affiliate: users.affiliate.email,
  });

  const store = await seedStore(users.vendor.id);
  console.log("Store seeded:", store.slug, store.approvalStatus);

  const affiliateProfile = await seedAffiliateProfile(users.affiliate.id);
  console.log(
    "Affiliate profile seeded:",
    affiliateProfile.referralCode,
    affiliateProfile.approvalStatus
  );

  const products = await seedProducts({ storeId: store.id });
  console.log("Products seeded:", {
    approved: products.approvedProduct.id,
    pending: products.pendingProduct.id,
    featured: products.featuredProduct.id,
  });

  await seedSubmissionAndCatalog({
    adminId: users.admin.id,
    vendorId: users.vendor.id,
    storeId: store.id,
  });
  console.log("Vendor submission and catalog seeded");

  await seedAddressesAndOrder({
    customerId: users.customer.id,
    approvedProductId: products.approvedProduct.id,
    featuredProductId: products.featuredProduct.id,
  });
  console.log("Addresses and sample order seeded");

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
