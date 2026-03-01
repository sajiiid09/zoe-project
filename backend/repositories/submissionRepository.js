import prisma from '../config/db.js';

const submissionInclude = {
  store: {
    select: {
      id: true,
      name: true,
      slug: true,
      approvalStatus: true,
    },
  },
  vendor: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  catalogProduct: true,
};

export class SubmissionRepository {
  create(data) {
    return prisma.vendorSubmission.create({
      data,
      include: submissionInclude,
    });
  }

  listForVendor(vendorId) {
    return prisma.vendorSubmission.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      include: submissionInclude,
    });
  }

  findById(id) {
    return prisma.vendorSubmission.findUnique({
      where: { id },
      include: submissionInclude,
    });
  }

  update(id, data) {
    return prisma.vendorSubmission.update({
      where: { id },
      data,
      include: submissionInclude,
    });
  }

  delete(id) {
    return prisma.vendorSubmission.delete({
      where: { id },
    });
  }

  listAll() {
    return prisma.vendorSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: submissionInclude,
    });
  }

  acceptSubmission({ submissionId, reviewerId, catalogProductData, supplyAgreementData }) {
    return prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.vendorSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'ACCEPTED',
          reviewedAt: new Date(),
          reviewedById: reviewerId,
          rejectionReason: null,
        },
      });

      const catalogProduct = await tx.catalogProduct.create({
        data: catalogProductData,
      });

      const supplyAgreement = await tx.vendorSupplyAgreement.create({
        data: {
          ...supplyAgreementData,
          catalogProductId: catalogProduct.id,
        },
      });

      return {
        submission: await tx.vendorSubmission.findUnique({
          where: { id: updatedSubmission.id },
          include: submissionInclude,
        }),
        catalogProduct,
        supplyAgreement,
      };
    });
  }
}

export const submissionRepository = new SubmissionRepository();
