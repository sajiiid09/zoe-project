import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { cancelOrder } from '../../controllers/orderController.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

const createCancelRequest = () => createMockRequest({
  user: { id: 'user-1', role: 'USER' },
  params: { id: 'order-1' },
  body: { reason: 'changed mind' },
});

test('cancelOrder returns 400 when transactional re-check finds order already cancelled', async () => {
  let stockIncrementCalled = false;
  let updateManyCalled = false;

  const restoreFindUnique = patchMethod(prisma.order, 'findUnique', async () => ({
    id: 'order-1',
    userId: 'user-1',
  }));

  const restoreTransaction = patchMethod(prisma, '$transaction', async (callback) => callback({
    order: {
      findUnique: async () => ({
        id: 'order-1',
        userId: 'user-1',
        status: 'cancelled',
        items: [
          { productId: 'product-1', quantity: 1 },
        ],
      }),
      updateMany: async () => {
        updateManyCalled = true;
        return { count: 1 };
      },
    },
    product: {
      update: async () => {
        stockIncrementCalled = true;
      },
    },
  }));

  const req = createCancelRequest();
  const res = createMockResponse();

  await runHandler(cancelOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Order cannot be cancelled',
  });
  assert.equal(updateManyCalled, false);
  assert.equal(stockIncrementCalled, false);

  restoreFindUnique();
  restoreTransaction();
});

test('cancelOrder returns 400 when guarded status update loses race in transaction', async () => {
  let stockIncrementCalled = false;

  const restoreFindUnique = patchMethod(prisma.order, 'findUnique', async () => ({
    id: 'order-1',
    userId: 'user-1',
  }));

  const restoreTransaction = patchMethod(prisma, '$transaction', async (callback) => callback({
    order: {
      findUnique: async (args) => {
        if (args?.include) {
          return {
            id: 'order-1',
            userId: 'user-1',
            status: 'processing',
            items: [
              { productId: 'product-1', quantity: 1 },
            ],
          };
        }

        return {
          id: 'order-1',
          userId: 'user-1',
          status: 'processing',
          items: [],
        };
      },
      updateMany: async () => ({ count: 0 }),
    },
    product: {
      update: async () => {
        stockIncrementCalled = true;
      },
    },
  }));

  const req = createCancelRequest();
  const res = createMockResponse();

  await runHandler(cancelOrder, req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Order cannot be cancelled',
  });
  assert.equal(stockIncrementCalled, false);

  restoreFindUnique();
  restoreTransaction();
});
