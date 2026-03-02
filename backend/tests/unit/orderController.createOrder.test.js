import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { createOrder } from '../../controllers/orderController.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

const createBaseRequest = (quantity) => createMockRequest({
  user: { id: 'user-1' },
  body: {
    items: [
      {
        product: 'product-1',
        quantity,
      },
    ],
  },
});

test('createOrder returns 400 for negative item quantity', async () => {
  let transactionCalled = false;

  const restoreFindMany = patchMethod(prisma.product, 'findMany', async () => ([
    { id: 'product-1', name: 'Desk Lamp', stock: 10, price: 100 },
  ]));
  const restoreTransaction = patchMethod(prisma, '$transaction', async () => {
    transactionCalled = true;
    return {};
  });

  const req = createBaseRequest(-5);
  const res = createMockResponse();

  await runHandler(createOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Invalid quantity',
  });
  assert.equal(transactionCalled, false);

  restoreFindMany();
  restoreTransaction();
});

test('createOrder returns 400 for zero item quantity', async () => {
  const restoreFindMany = patchMethod(prisma.product, 'findMany', async () => ([
    { id: 'product-1', name: 'Desk Lamp', stock: 10, price: 100 },
  ]));

  const req = createBaseRequest(0);
  const res = createMockResponse();

  await runHandler(createOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Invalid quantity',
  });

  restoreFindMany();
});

test('createOrder returns 400 for fractional item quantity', async () => {
  const restoreFindMany = patchMethod(prisma.product, 'findMany', async () => ([
    { id: 'product-1', name: 'Desk Lamp', stock: 10, price: 100 },
  ]));

  const req = createBaseRequest(1.5);
  const res = createMockResponse();

  await runHandler(createOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Invalid quantity',
  });

  restoreFindMany();
});


test('createOrder returns 400 when atomic stock reservation fails in transaction', async () => {
  let orderCreateCalled = false;

  const restoreFindMany = patchMethod(prisma.product, 'findMany', async () => ([
    { id: 'product-1', name: 'Desk Lamp', stock: 10, price: 100 },
  ]));
  const restoreTransaction = patchMethod(prisma, '$transaction', async (callback) => callback({
    product: {
      updateMany: async () => ({ count: 0 }),
    },
    order: {
      create: async () => {
        orderCreateCalled = true;
        return {};
      },
    },
  }));

  const req = createBaseRequest(1);
  const res = createMockResponse();

  await runHandler(createOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Insufficient stock for Desk Lamp',
  });
  assert.equal(orderCreateCalled, false);

  restoreFindMany();
  restoreTransaction();
});
