import prisma from '../config/db.js';

export class CatalogRepository {
  listAll() {
    return prisma.catalogProduct.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sourceSubmission: {
          select: {
            id: true,
            title: true,
            vendorId: true,
          },
        },
      },
    });
  }

  findById(id) {
    return prisma.catalogProduct.findUnique({
      where: { id },
      include: {
        sourceSubmission: {
          select: {
            id: true,
            title: true,
            vendorId: true,
          },
        },
      },
    });
  }

  update(id, data) {
    return prisma.catalogProduct.update({
      where: { id },
      data,
      include: {
        sourceSubmission: {
          select: {
            id: true,
            title: true,
            vendorId: true,
          },
        },
      },
    });
  }
}

export const catalogRepository = new CatalogRepository();
