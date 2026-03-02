import test from 'node:test';
import assert from 'node:assert/strict';

import bcrypt from 'bcryptjs';

import prisma from '../../config/db.js';
import { getProducts } from '../../controllers/productController.js';
import { getAllUsers, getVendors, registerUser } from '../../controllers/userController.js';
import paymentRoutes from '../../routes/paymentRoutes.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

const findWebhookHandler = () => paymentRoutes.stack.find((layer) =>
  layer?.route?.path === '/webhook' && layer.route.methods?.post
)?.route.stack[1].handle;

test('registerUser rejects passwords shorter than 8 chars before hashing', async () => {
  let hashCalled = false;

  const restoreHash = patchMethod(bcrypt, 'hash', async () => {
    hashCalled = true;
    return 'hashed';
  });

  const req = createMockRequest({
    body: {
      email: 'short@example.com',
      password: 'short',
    },
  });
  const res = createMockResponse();

  await runHandler(registerUser, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Password must be at least 8 characters long',
  });
  assert.equal(hashCalled, false);

  restoreHash();
});

test('getProducts caps large limit values at 100', async () => {
  let capturedTake = null;

  const restores = [
    patchMethod(prisma.product, 'findMany', async ({ take }) => {
      capturedTake = take;
      return [];
    }),
    patchMethod(prisma.product, 'count', async () => 0),
    patchMethod(prisma, '$transaction', async (operations) => Promise.all(operations)),
  ];

  const req = createMockRequest({ query: { page: '1', limit: '9999' } });
  const res = createMockResponse();

  await runHandler(getProducts, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(capturedTake, 100);
  assert.equal(res.body.pagination.currentPage, 1);

  restores.reverse().forEach((restore) => restore());
});

test('getAllUsers caps large limit values at 100', async () => {
  let capturedTake = null;

  const restores = [
    patchMethod(prisma.user, 'findMany', async ({ take }) => {
      capturedTake = take;
      return [];
    }),
    patchMethod(prisma.user, 'count', async () => 0),
    patchMethod(prisma, '$transaction', async (operations) => Promise.all(operations)),
  ];

  const req = createMockRequest({ query: { page: '1', limit: '5000' } });
  const res = createMockResponse();

  await runHandler(getAllUsers, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(capturedTake, 100);

  restores.reverse().forEach((restore) => restore());
});

test('getVendors caps large limit values at 100', async () => {
  let capturedTake = null;

  const restores = [
    patchMethod(prisma.user, 'findMany', async ({ take }) => {
      capturedTake = take;
      return [];
    }),
    patchMethod(prisma.user, 'count', async () => 0),
    patchMethod(prisma, '$transaction', async (operations) => Promise.all(operations)),
  ];

  const req = createMockRequest({ query: { page: '1', limit: '2500' } });
  const res = createMockResponse();

  await runHandler(getVendors, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(capturedTake, 100);

  restores.reverse().forEach((restore) => restore());
});

test('webhook rejects requests when signing secret exists but signature is missing', async () => {
  const webhookHandler = findWebhookHandler();
  assert.ok(webhookHandler);

  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';

  const req = createMockRequest({
    headers: {},
  });
  req.body = Buffer.from('{}');
  const res = createMockResponse();

  await runHandler(webhookHandler, req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body, 'Webhook Error: Missing Stripe signature');

  if (previousSecret === undefined) {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  } else {
    process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});
