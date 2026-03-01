import test from 'node:test';
import assert from 'node:assert/strict';

import bcrypt from 'bcryptjs';

import prisma from '../../config/db.js';
import { loginUser } from '../../controllers/userController.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('login blocks unpaid affiliate accounts with payment-required response', async (t) => {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => ({
      id: 'affiliate-user-1',
      email: 'affiliate@example.com',
      password: hashedPassword,
      firstName: null,
      lastName: null,
      phone: null,
      profilePicture: null,
      role: 'AFFILIATE',
      isActive: true,
      vendorFeePaid: false,
      affiliateFeePaid: false,
      preferences: null,
      addresses: [],
      store: null,
      affiliateProfile: null,
      lastLogin: null,
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
    },
  });
  const res = createMockResponse();

  await runHandler(loginUser, req, res);

  assert.equal(res.statusCode, 402);
  assert.equal(res.body.requiresPayment, true);
  assert.match(res.body.message, /Affiliate registration fee required/);
});
