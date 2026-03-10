import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { optionalAuth, requireAuth } from '../../middleware/authMiddleware.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runMiddleware,
} from '../helpers/testUtils.js';

test('requireAuth accepts Bearer tokens during migration', async (t) => {
  const user = { id: 'user-1', role: 'CUSTOMER', isActive: true, addresses: [] };
  const restoreFindUnique = patchMethod(prisma.user, 'findUnique', async () => user);

  t.after(() => {
    restoreFindUnique();
  });

  const token = createAuthToken(user.id);
  const req = createMockRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const res = createMockResponse();

  const result = await runMiddleware(requireAuth, req, res);

  assert.equal(result.nextCalled, true);
  assert.equal(result.nextError, null);
  assert.equal(req.user.id, user.id);
});

test('requireAuth accepts cookie tokens as primary transport', async (t) => {
  const user = { id: 'user-2', role: 'CUSTOMER', isActive: true, addresses: [] };
  const restoreFindUnique = patchMethod(prisma.user, 'findUnique', async () => user);

  t.after(() => {
    restoreFindUnique();
  });

  const token = createAuthToken(user.id);
  const req = createMockRequest({
    headers: {
      cookie: `zoe_market_session=${encodeURIComponent(token)}`,
    },
  });
  const res = createMockResponse();

  const result = await runMiddleware(requireAuth, req, res);

  assert.equal(result.nextCalled, true);
  assert.equal(result.nextError, null);
  assert.equal(req.user.id, user.id);
});

test('optionalAuth sets req.user to null when no auth token is present', async () => {
  const req = createMockRequest();
  const res = createMockResponse();

  const result = await runMiddleware(optionalAuth, req, res);

  assert.equal(result.nextCalled, true);
  assert.equal(result.nextError, null);
  assert.equal(req.user, null);
});

test('requireAuth rejects requests with no token', async () => {
  const req = createMockRequest();
  const res = createMockResponse();

  const result = await runMiddleware(requireAuth, req, res);

  assert.equal(result.nextCalled, true);
  assert.equal(result.nextError?.statusCode, 401);
  assert.equal(result.nextError?.message, 'Missing or malformed token');
});
