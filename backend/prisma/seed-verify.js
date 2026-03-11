import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const prisma = new PrismaClient();

const REQUIRED_SEEDED_IDS = {
  users: [
    "admin@example.com",
    "customer@example.com",
    "vendor@example.com",
    "affiliate@example.com",
  ],
  orderId: "seed_order_customer_001",
  storeSlug: "decor-store",
};

const STOREFRONT_CATEGORIES = [
  "electronics",
  "fashion",
  "groceries",
  "home",
  "beauty",
  "sports",
  "baby",
  "automotive",
];

const MIN_APPROVED_PRODUCTS_PER_CATEGORY = 2;
const MIN_APPROVED_ACTIVE_TOTAL =
  STOREFRONT_CATEGORIES.length * MIN_APPROVED_PRODUCTS_PER_CATEGORY;

async function main() {
  const [users, store, order, counts, approvedActiveByCategory, approvedActiveTotal] =
    await Promise.all([
    prisma.user.findMany({
      where: { email: { in: REQUIRED_SEEDED_IDS.users } },
      select: { email: true, role: true },
    }),
    prisma.store.findUnique({
      where: { slug: REQUIRED_SEEDED_IDS.storeSlug },
      select: { id: true, approvalStatus: true },
    }),
    prisma.order.findUnique({
      where: { id: REQUIRED_SEEDED_IDS.orderId },
      select: { id: true, orderNumber: true, status: true },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.catalogProduct.count(),
      prisma.vendorSubmission.count(),
      prisma.order.count(),
      prisma.orderItem.count(),
      prisma.userAddress.count(),
      prisma.affiliateProfile.count(),
    ]),
    prisma.product.groupBy({
      by: ["category"],
      where: { approvalStatus: "APPROVED", isActive: true },
      _count: { _all: true },
    }),
    prisma.product.count({
      where: { approvalStatus: "APPROVED", isActive: true },
    }),
    ]);

  const [
    userCount,
    productCount,
    catalogCount,
    submissionCount,
    orderCount,
    orderItemCount,
    addressCount,
    affiliateCount,
  ] = counts;

  const missingUsers = REQUIRED_SEEDED_IDS.users.filter(
    (email) => !users.some((user) => user.email === email)
  );

  if (missingUsers.length > 0) {
    throw new Error(`Missing seeded users: ${missingUsers.join(", ")}`);
  }

  if (!store) {
    throw new Error("Seed verification failed: required store not found");
  }

  if (!order) {
    throw new Error("Seed verification failed: sample order not found");
  }

  if (approvedActiveTotal < MIN_APPROVED_ACTIVE_TOTAL) {
    throw new Error(
      `Seed verification failed: expected at least ${MIN_APPROVED_ACTIVE_TOTAL} approved active products, found ${approvedActiveTotal}`
    );
  }

  const categoryCoverage = new Map(
    approvedActiveByCategory.map((row) => [row.category || "uncategorized", row._count._all])
  );

  const missingCoverageCategories = STOREFRONT_CATEGORIES.filter(
    (category) =>
      (categoryCoverage.get(category) || 0) < MIN_APPROVED_PRODUCTS_PER_CATEGORY
  );

  if (missingCoverageCategories.length > 0) {
    throw new Error(
      `Seed verification failed: insufficient approved products for categories: ${missingCoverageCategories.join(", ")}`
    );
  }

  console.log("Seed verification passed.");
  console.log("Snapshot counts:", {
    users: userCount,
    products: productCount,
    catalogProducts: catalogCount,
    vendorSubmissions: submissionCount,
    orders: orderCount,
    orderItems: orderItemCount,
    addresses: addressCount,
    affiliateProfiles: affiliateCount,
    approvedActiveProducts: approvedActiveTotal,
    categoryCoverage: Object.fromEntries(categoryCoverage),
  });
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
