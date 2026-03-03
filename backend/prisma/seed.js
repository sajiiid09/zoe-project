import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.catalogProduct.deleteMany({});
  await prisma.vendorSubmission.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.affiliateProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Admin created:', admin.email);

  // 2. Create Vendor
  const vendor = await prisma.user.create({
    data: {
      email: 'vendor@example.com',
      password: hashedPassword,
      firstName: 'Vendor',
      lastName: 'One',
      role: 'VENDOR',
      isActive: true,
      vendorFeePaid: true,
      store: {
        create: {
          name: 'Decor Store',
          slug: 'decor-store',
          description: 'High quality home decor',
          approvalStatus: 'APPROVED',
          isActive: true,
        },
      },
    },
    include: { store: true },
  });
  console.log('Vendor created:', vendor.email);

  // 3. Create Affiliate
  const affiliate = await prisma.user.create({
    data: {
      email: 'affiliate@example.com',
      password: hashedPassword,
      firstName: 'Affiliate',
      lastName: 'One',
      role: 'AFFILIATE',
      isActive: true,
      affiliateFeePaid: true,
      affiliateProfile: {
        create: {
          displayName: 'Design Guru',
          referralCode: 'DESIGNGURU',
          approvalStatus: 'APPROVED',
          isActive: true,
        },
      },
    },
  });
  console.log('Affiliate created:', affiliate.email);

  // 4. Create some Catalog Products (Admin owned)
  const products = [
    {
      title: 'Minimalist Vase',
      description: 'A beautifully crafted minimalist ceramic vase perfect for modern interiors. Its clean lines and neutral tone complement any décor.',
      category: 'vases',
      retailPrice: 45.00,
      stock: 50,
      status: 'ACTIVE',
      createdByAdminId: admin.id,
      images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80'],
    },
    {
      title: 'Wall Mirror',
      description: 'Elegant wall mirror with a sleek frame design. Perfect for adding depth and light to your living spaces.',
      category: 'mirrors',
      retailPrice: 89.00,
      stock: 30,
      status: 'ACTIVE',
      createdByAdminId: admin.id,
      images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop&q=80'],
    },
    {
      title: 'Plant Pot',
      description: 'Handcrafted ceramic plant pot with drainage holes. Ideal for indoor plants and succulents.',
      category: 'pots',
      retailPrice: 32.00,
      stock: 100,
      status: 'ACTIVE',
      createdByAdminId: admin.id,
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=1000&fit=crop&q=80'],
    },
    {
        title: 'Table Lamp',
        description: 'Modern table lamp with adjustable brightness. Combines style with functionality for your workspace.',
        category: 'lamps',
        retailPrice: 75.00,
        stock: 40,
        status: 'ACTIVE',
        createdByAdminId: admin.id,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80'],
    }
  ];

  for (const productData of products) {
    await prisma.catalogProduct.create({
      data: productData,
    });
  }
  console.log('Catalog products created');

  console.log('Seeding finished successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
