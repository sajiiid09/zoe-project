import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { updateMyStore } from '../../controllers/vendorController.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('vendor store updates resubmit rejected stores when a paid vendor saves a complete form', async (t) => {
  const rejectedStore = {
    id: 'store-1',
    ownerId: 'vendor-1',
    name: 'Old Store',
    email: 'old@example.com',
    approvalStatus: 'REJECTED',
    rejectionNote: 'Need clearer support details',
    isActive: false,
  };

  const restores = [
    patchMethod(prisma.store, 'findUnique', async () => rejectedStore),
    patchMethod(prisma.store, 'update', async ({ data }) => ({
      ...rejectedStore,
      ...data,
    })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const req = createMockRequest({
    user: {
      id: 'vendor-1',
      role: 'VENDOR',
      vendorFeePaid: true,
    },
    body: {
      name: 'Updated Store',
      email: 'support@example.com',
    },
  });
  const res = createMockResponse();

  await runHandler(updateMyStore, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.approvalStatus, 'PENDING');
  assert.equal(res.body.data.rejectionNote, null);
  assert.equal(res.body.data.isActive, true);
});
