import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { createAffiliateFeeSession, paymentClient } from '../../routes/paymentRoutes.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('affiliate fee endpoint creates a Stripe session for AFFILIATE users', async (t) => {
  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => ({
      id: 'affiliate-user-1',
      email: 'affiliate@example.com',
      role: 'AFFILIATE',
      isActive: true,
      affiliateFeePaid: false,
      vendorFeePaid: false,
      addresses: [],
    })),
    patchMethod(prisma.user, 'update', async () => ({ id: 'affiliate-user-1' })),
    patchMethod(paymentClient.checkout.sessions, 'create', async () => ({
      id: 'cs_affiliate_1',
      url: 'https://stripe.test/session',
    })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const req = createMockRequest({
    headers: {
      authorization: `Bearer ${createAuthToken('affiliate-user-1')}`,
    },
  });
  const res = createMockResponse();

  await runHandler(requireAuth, req, res);
  await runHandler(createAffiliateFeeSession, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.sessionId, 'cs_affiliate_1');
});
