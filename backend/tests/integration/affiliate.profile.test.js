import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import {
  createAffiliateProfile,
  getAffiliateProfile,
  updateAffiliateProfile,
} from '../../controllers/affiliateController.js';
import { requireAffiliate, requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { affiliateProfileService } from '../../services/affiliateProfileService.js';
import {
  createAffiliateProfileSchema,
  updateAffiliateProfileSchema,
} from '../../validators/affiliateValidators.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('affiliate profile routes create, read, and update the authenticated affiliate profile', async (t) => {
  const affiliateUser = {
    id: 'affiliate-user-1',
    email: 'affiliate@example.com',
    role: 'AFFILIATE',
    isActive: true,
    affiliateFeePaid: true,
    vendorFeePaid: false,
    addresses: [],
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => affiliateUser),
    patchMethod(affiliateProfileService, 'createProfile', async () => ({
      id: 'profile-1',
      userId: affiliateUser.id,
      displayName: 'Growth Partner',
      referralCode: 'growth-partner',
      approvalStatus: 'PENDING',
      rejectionNote: null,
      isActive: true,
    })),
    patchMethod(affiliateProfileService, 'getProfile', async () => ({
      id: 'profile-1',
      userId: affiliateUser.id,
      displayName: 'Growth Partner',
      referralCode: 'growth-partner',
      approvalStatus: 'PENDING',
      rejectionNote: null,
      isActive: true,
    })),
    patchMethod(affiliateProfileService, 'updateProfile', async () => ({
      id: 'profile-1',
      userId: affiliateUser.id,
      displayName: 'Updated Partner',
      referralCode: 'growth-partner',
      approvalStatus: 'PENDING',
      rejectionNote: null,
      isActive: true,
    })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = {
    authorization: `Bearer ${createAuthToken(affiliateUser.id)}`,
  };

  const createReq = createMockRequest({
    headers,
    body: {
      displayName: 'Growth Partner',
      referralCode: 'growth-partner',
    },
  });
  const createRes = createMockResponse();
  await runHandler(requireAuth, createReq, createRes);
  await runHandler(requireAffiliate, createReq, createRes);
  await runHandler(validate(createAffiliateProfileSchema), createReq, createRes);
  await runHandler(createAffiliateProfile, createReq, createRes);
  assert.equal(createRes.statusCode, 201);
  assert.equal(createRes.body.data.displayName, 'Growth Partner');

  const getReq = createMockRequest({ headers });
  const getRes = createMockResponse();
  await runHandler(requireAuth, getReq, getRes);
  await runHandler(requireAffiliate, getReq, getRes);
  await runHandler(getAffiliateProfile, getReq, getRes);
  assert.equal(getRes.statusCode, 200);
  assert.equal(getRes.body.data.referralCode, 'growth-partner');

  const updateReq = createMockRequest({
    headers,
    body: {
      displayName: 'Updated Partner',
    },
  });
  const updateRes = createMockResponse();
  await runHandler(requireAuth, updateReq, updateRes);
  await runHandler(requireAffiliate, updateReq, updateRes);
  await runHandler(validate(updateAffiliateProfileSchema), updateReq, updateRes);
  await runHandler(updateAffiliateProfile, updateReq, updateRes);
  assert.equal(updateRes.statusCode, 200);
  assert.equal(updateRes.body.data.displayName, 'Updated Partner');
});
