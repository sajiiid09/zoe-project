import test from 'node:test';
import assert from 'node:assert/strict';

import { AffiliateProfileService } from '../../services/affiliateProfileService.js';

test('affiliate profile service allows draft profile creation before payment', async () => {
  let storedProfile = null;

  const mockRepository = {
    findProfileByUserId: async () => storedProfile,
    createProfile: async (data) => {
      storedProfile = {
        id: 'profile-1',
        ...data,
        rejectionNote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: data.userId,
          email: 'affiliate@example.com',
          affiliateFeePaid: false,
        },
      };
      return storedProfile;
    },
  };

  const service = new AffiliateProfileService(mockRepository);
  const created = await service.createProfile(
    { id: 'affiliate-1', affiliateFeePaid: false },
    {
      displayName: 'Growth Partner',
      referralCode: 'GROWTH123',
      bio: 'Dhaka audience',
      website: 'https://example.com',
    }
  );

  assert.equal(created.approvalStatus, 'PENDING');
  assert.equal(created.displayName, 'Growth Partner');
});

test('affiliate profile service resubmits rejected profiles when a paid user updates a complete profile', async () => {
  const existingProfile = {
    id: 'profile-1',
    userId: 'affiliate-1',
    displayName: 'Growth Partner',
    bio: 'Old audience',
    website: 'https://old.example.com',
    payoutEmail: null,
    approvalStatus: 'REJECTED',
    rejectionNote: 'Missing details',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'affiliate-1',
      email: 'affiliate@example.com',
      affiliateFeePaid: true,
    },
  };

  const mockRepository = {
    findProfileByUserId: async () => existingProfile,
    updateProfileByUserId: async (_userId, data) => ({
      ...existingProfile,
      ...data,
      user: existingProfile.user,
      updatedAt: new Date(),
    }),
  };

  const service = new AffiliateProfileService(mockRepository);
  const updated = await service.updateProfile('affiliate-1', {
    bio: 'Updated audience',
    website: 'https://new.example.com',
  });

  assert.equal(updated.approvalStatus, 'PENDING');
  assert.equal(updated.rejectionNote, null);
  assert.equal(updated.isActive, true);
});
