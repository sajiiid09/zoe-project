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
    electronicsA: "seed_product_electronics_a",
    electronicsB: "seed_product_electronics_b",
    fashionA: "seed_product_fashion_a",
    fashionB: "seed_product_fashion_b",
    groceriesA: "seed_product_groceries_a",
    groceriesB: "seed_product_groceries_b",
    beautyA: "seed_product_beauty_a",
    beautyB: "seed_product_beauty_b",
    sportsA: "seed_product_sports_a",
    sportsB: "seed_product_sports_b",
    babyA: "seed_product_baby_a",
    babyB: "seed_product_baby_b",
    automotiveA: "seed_product_automotive_a",
    automotiveB: "seed_product_automotive_b",
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

const PRODUCT_SEED_MATRIX = [
  {
    id: SEED_IDS.products.approved,
    name: "Nordic Ceramic Vase",
    description: "Minimal handcrafted vase for modern interiors.",
    category: "home",
    price: 59.99,
    stock: 45,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.featured,
    name: "Signature Table Lamp",
    description: "Admin-curated featured product.",
    category: "home",
    price: 89.5,
    stock: 35,
    isFeatured: true,
    attachToStore: false,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.electronicsA,
    name: "Wireless Earbuds Pro",
    description: "Noise-isolating earbuds with compact charging case.",
    category: "electronics",
    price: 79.99,
    stock: 60,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.electronicsB,
    name: "Smart LED Desk Lamp",
    description: "Adjustable brightness desk lamp with touch controls.",
    category: "electronics",
    price: 49.0,
    stock: 50,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.fashionA,
    name: "Cotton Everyday Hoodie",
    description: "Lightweight hoodie for daily wear.",
    category: "fashion",
    price: 39.5,
    stock: 70,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.fashionB,
    name: "Urban Denim Jacket",
    description: "Classic fit denim jacket with soft lining.",
    category: "fashion",
    price: 64.0,
    stock: 42,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.groceriesA,
    name: "Organic Basmati Rice 5kg",
    description: "Long-grain aromatic rice, premium quality.",
    category: "groceries",
    price: 18.99,
    stock: 120,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.groceriesB,
    name: "Cold Pressed Olive Oil",
    description: "Extra virgin olive oil for healthy cooking.",
    category: "groceries",
    price: 15.75,
    stock: 90,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.beautyA,
    name: "Vitamin C Brightening Serum",
    description: "Daily serum for brighter, even-looking skin.",
    category: "beauty",
    price: 24.99,
    stock: 80,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.beautyB,
    name: "Hydrating Face Moisturizer",
    description: "Non-greasy moisturizer for all skin types.",
    category: "beauty",
    price: 19.5,
    stock: 85,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.sportsA,
    name: "Yoga Mat Pro",
    description: "Anti-slip yoga mat for home and studio workouts.",
    category: "sports",
    price: 29.99,
    stock: 65,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.sportsB,
    name: "Adjustable Dumbbell Pair",
    description: "Space-saving dumbbells with quick weight switching.",
    category: "sports",
    price: 129.0,
    stock: 28,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.babyA,
    name: "Gentle Baby Diaper Pack",
    description: "Soft absorbent diapers for day and night use.",
    category: "baby",
    price: 22.99,
    stock: 110,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.babyB,
    name: "Baby Feeding Bottle Set",
    description: "BPA-free bottle set with anti-colic design.",
    category: "baby",
    price: 17.25,
    stock: 95,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.automotiveA,
    name: "Portable Tire Inflator",
    description: "12V portable inflator with digital pressure gauge.",
    category: "automotive",
    price: 42.0,
    stock: 48,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: SEED_IDS.products.automotiveB,
    name: "Car Interior Cleaning Kit",
    description: "Complete interior cleaning kit for dashboard and seats.",
    category: "automotive",
    price: 27.49,
    stock: 57,
    isFeatured: false,
    attachToStore: true,
    image:
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?w=800&h=1000&fit=crop&q=80",
  },
];

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
  const approvedProducts = {};

  for (const productDefinition of PRODUCT_SEED_MATRIX) {
    const shouldAttachStore = productDefinition.attachToStore !== false;
    const seededProduct = await prisma.product.upsert({
      where: { id: productDefinition.id },
      update: {
        name: productDefinition.name,
        description: productDefinition.description,
        category: productDefinition.category,
        price: decimal(productDefinition.price),
        stock: productDefinition.stock,
        images: [productDefinition.image],
        isActive: true,
        isFeatured: productDefinition.isFeatured,
        approvalStatus: "APPROVED",
        rejectionNote: null,
        storeId: shouldAttachStore ? storeId : null,
      },
      create: {
        id: productDefinition.id,
        name: productDefinition.name,
        description: productDefinition.description,
        category: productDefinition.category,
        price: decimal(productDefinition.price),
        stock: productDefinition.stock,
        images: [productDefinition.image],
        isActive: true,
        isFeatured: productDefinition.isFeatured,
        approvalStatus: "APPROVED",
        storeId: shouldAttachStore ? storeId : null,
      },
    });

    approvedProducts[productDefinition.id] = seededProduct;
  }

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

  return {
    approvedProducts,
    approvedProduct: approvedProducts[SEED_IDS.products.approved],
    featuredProduct: approvedProducts[SEED_IDS.products.featured],
    pendingProduct,
  };
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
  const approvedCategoryCoverage = Object.values(products.approvedProducts).reduce(
    (coverage, product) => {
      const category = product.category || "uncategorized";
      coverage[category] = (coverage[category] || 0) + 1;
      return coverage;
    },
    {}
  );

  console.log("Products seeded:", {
    approved: products.approvedProduct.id,
    pending: products.pendingProduct.id,
    featured: products.featuredProduct.id,
    approvedCount: Object.keys(products.approvedProducts).length,
    categoryCoverage: approvedCategoryCoverage,
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
