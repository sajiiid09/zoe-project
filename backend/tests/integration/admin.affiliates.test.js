import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import {
  approveAffiliateProfile,
  getAffiliates,
  rejectAffiliateProfile,
} from '../../controllers/adminAffiliateController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import { affiliateProfileService } from '../../services/affiliateProfileService.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('admin affiliate endpoints list, approve, and reject affiliate profiles', async (t) => {
  const adminUser = {
    id: 'admin-user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
    addresses: [],
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => adminUser),
    patchMethod(affiliateProfileService, 'listProfiles', async () => [
      { id: 'profile-1', approvalStatus: 'PENDING' },
    ]),
    patchMethod(affiliateProfileService, 'approveProfile', async () => ({
      id: 'profile-1',
      approvalStatus: 'APPROVED',
    })),
    patchMethod(affiliateProfileService, 'rejectProfile', async () => ({
      id: 'profile-1',
      approvalStatus: 'REJECTED',
    })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = { authorization: `Bearer ${createAuthToken(adminUser.id)}` };

  const listReq = createMockRequest({ headers });
  const listRes = createMockResponse();
  await runHandler(requireAuth, listReq, listRes);
  await runHandler(requireAdmin, listReq, listRes);
  await runHandler(getAffiliates, listReq, listRes);
  assert.equal(listRes.statusCode, 200);
  assert.equal(listRes.body.data.length, 1);

  const approveReq = createMockRequest({
    headers,
    params: { affiliateProfileId: 'profile-1' },
  });
  const approveRes = createMockResponse();
  await runHandler(requireAuth, approveReq, approveRes);
  await runHandler(requireAdmin, approveReq, approveRes);
  await runHandler(approveAffiliateProfile, approveReq, approveRes);
  assert.equal(approveRes.body.data.approvalStatus, 'APPROVED');

  const rejectReq = createMockRequest({
    headers,
    params: { affiliateProfileId: 'profile-1' },
    body: { reason: 'Incomplete profile' },
  });
  const rejectRes = createMockResponse();
  await runHandler(requireAuth, rejectReq, rejectRes);
  await runHandler(requireAdmin, rejectReq, rejectRes);
  await runHandler(rejectAffiliateProfile, rejectReq, rejectRes);
  assert.equal(rejectRes.body.data.approvalStatus, 'REJECTED');
});
