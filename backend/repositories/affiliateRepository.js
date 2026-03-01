import prisma from '../config/db.js';

export class AffiliateRepository {
  createProfile(data) {
    return prisma.affiliateProfile.create({ data });
  }

  findProfileByUserId(userId) {
    return prisma.affiliateProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            affiliateFeePaid: true,
          },
        },
      },
    });
  }

  findProfileById(id) {
    return prisma.affiliateProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            affiliateFeePaid: true,
          },
        },
      },
    });
  }

  updateProfileByUserId(userId, data) {
    return prisma.affiliateProfile.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            affiliateFeePaid: true,
          },
        },
      },
    });
  }

  listProfiles() {
    return prisma.affiliateProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
            affiliateFeePaid: true,
            createdAt: true,
          },
        },
      },
    });
  }

  updateApproval(id, data) {
    return prisma.affiliateProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            affiliateFeePaid: true,
          },
        },
      },
    });
  }
}

export const affiliateRepository = new AffiliateRepository();
