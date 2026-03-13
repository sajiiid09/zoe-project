import { affiliateRepository } from '../repositories/affiliateRepository.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

const mapAffiliateProfile = (profile) => ({
  id: profile.id,
  userId: profile.userId,
  displayName: profile.displayName,
  referralCode: profile.referralCode,
  bio: profile.bio,
  website: profile.website,
  payoutEmail: profile.payoutEmail,
  commissionRate: Number(profile.commissionRate),
  approvalStatus: profile.approvalStatus,
  rejectionNote: profile.rejectionNote,
  isActive: profile.isActive,
  user: profile.user,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

const isProfileComplete = (profile) => {
  return Boolean(profile?.displayName?.trim() && profile?.bio?.trim() && profile?.website?.trim());
};

export class AffiliateProfileService {
  constructor(repository = affiliateRepository) {
    this.repository = repository;
  }

  async createProfile(user, data) {
    const existing = await this.repository.findProfileByUserId(user.id);

    if (existing) {
      throw new ConflictError('Affiliate profile already exists');
    }

    const created = await this.repository.createProfile({
      userId: user.id,
      displayName: data.displayName,
      referralCode: data.referralCode,
      bio: data.bio || null,
      website: data.website || null,
      payoutEmail: data.payoutEmail || null,
      approvalStatus: 'PENDING',
      isActive: true,
    });

    return mapAffiliateProfile(await this.repository.findProfileByUserId(created.userId));
  }

  async getProfile(userId) {
    const profile = await this.repository.findProfileByUserId(userId);

    if (!profile) {
      throw new NotFoundError('Affiliate profile not found');
    }

    return mapAffiliateProfile(profile);
  }

  async updateProfile(userId, data) {
    const existing = await this.repository.findProfileByUserId(userId);

    if (!existing) {
      throw new NotFoundError('Affiliate profile not found');
    }

    const nextProfileState = {
      displayName: data.displayName ?? existing.displayName,
      bio: data.bio ?? existing.bio,
      website: data.website ?? existing.website,
      payoutEmail: data.payoutEmail ?? existing.payoutEmail,
    };

    const update = { ...nextProfileState };

    if (
      existing.approvalStatus === 'REJECTED' &&
      existing.user?.affiliateFeePaid &&
      isProfileComplete(nextProfileState)
    ) {
      update.approvalStatus = 'PENDING';
      update.rejectionNote = null;
      update.isActive = true;
    }

    const updated = await this.repository.updateProfileByUserId(userId, update);

    return mapAffiliateProfile(updated);
  }

  async listProfiles() {
    const profiles = await this.repository.listProfiles();
    return profiles.map(mapAffiliateProfile);
  }

  async approveProfile(id) {
    const existing = await this.repository.findProfileById(id);

    if (!existing) {
      throw new NotFoundError('Affiliate profile not found');
    }

    const updated = await this.repository.updateApproval(id, {
      approvalStatus: 'APPROVED',
      rejectionNote: null,
      isActive: true,
    });

    return mapAffiliateProfile(updated);
  }

  async rejectProfile(id, reason) {
    const existing = await this.repository.findProfileById(id);

    if (!existing) {
      throw new NotFoundError('Affiliate profile not found');
    }

    const updated = await this.repository.updateApproval(id, {
      approvalStatus: 'REJECTED',
      rejectionNote: reason || null,
      isActive: false,
    });

    return mapAffiliateProfile(updated);
  }
}

export const affiliateProfileService = new AffiliateProfileService();
