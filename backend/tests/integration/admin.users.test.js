import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { getAllUsers, updateUser } from '../../controllers/userController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('admin user endpoints expose and update isActive state', async (t) => {
  const adminUser = {
    id: 'admin-user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
    addresses: [],
  };

  let updatedUser = {
    id: 'vendor-user-1',
    email: 'vendor@example.com',
    firstName: 'Vendor',
    lastName: 'User',
    phone: null,
    profilePicture: null,
    role: 'VENDOR',
    isActive: false,
    vendorFeePaid: true,
    affiliateFeePaid: false,
    preferences: null,
    addresses: [],
    store: null,
    affiliateProfile: null,
    lastLogin: null,
    createdAt: new Date().toISOString(),
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async ({ where }) => {
      if (where?.id === adminUser.id) {
        return adminUser;
      }

      return updatedUser;
    }),
    patchMethod(prisma, '$transaction', async () => [[updatedUser], 1]),
    patchMethod(prisma.user, 'update', async ({ data }) => {
      updatedUser = { ...updatedUser, ...data };
      return updatedUser;
    }),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = {
    authorization: `Bearer ${createAuthToken(adminUser.id)}`,
  };

  const listReq = createMockRequest({ headers });
  const listRes = createMockResponse();
  await runHandler(requireAuth, listReq, listRes);
  await runHandler(requireAdmin, listReq, listRes);
  await runHandler(getAllUsers, listReq, listRes);

  assert.equal(listRes.statusCode, 200);
  assert.equal(listRes.body.data[0].isActive, false);

  const updateReq = createMockRequest({
    headers,
    params: { id: updatedUser.id },
    body: { isActive: true },
  });
  const updateRes = createMockResponse();
  await runHandler(requireAuth, updateReq, updateRes);
  await runHandler(requireAdmin, updateReq, updateRes);
  await runHandler(updateUser, updateReq, updateRes);

  assert.equal(updateRes.statusCode, 200);
  assert.equal(updateRes.body.data.isActive, true);
});
