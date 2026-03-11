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

async function main() {
  const [users, store, order, counts] = await Promise.all([
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
