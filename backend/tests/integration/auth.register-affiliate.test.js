import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { registerUser } from '../../controllers/userController.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('register supports AFFILIATE accounts', async (t) => {
  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => null),
    patchMethod(prisma.user, 'create', async ({ data }) => ({
      id: 'affiliate-user-1',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: null,
      profilePicture: null,
      role: data.role,
      vendorFeePaid: false,
      affiliateFeePaid: false,
      preferences: null,
      addresses: [],
      store: null,
      affiliateProfile: null,
      lastLogin: data.lastLogin,
      createdAt: new Date().toISOString(),
    })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const req = createMockRequest({
    body: {
      email: 'affiliate@example.com',
      password: 'password123',
      role: 'AFFILIATE',
    },
  });
  const res = createMockResponse();

  await runHandler(registerUser, req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.user.role, 'AFFILIATE');
  assert.equal(res.body.user.affiliateFeePaid, false);
});
