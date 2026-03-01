import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { vendorSubmissionService, VendorSubmissionService } from '../../services/vendorSubmissionService.js';
import { patchMethod } from '../helpers/testUtils.js';

test('vendor submission service enforces vendor profile approval before creation', async (t) => {
  const restore = patchMethod(prisma.store, 'findUnique', async () => ({
    id: 'store-1',
    ownerId: 'vendor-1',
    approvalStatus: 'APPROVED',
  }));

  t.after(() => restore());

  const mockRepo = {
    create: async (data) => ({
      id: 'submission-1',
      ...data,
      store: { id: 'store-1', name: 'Supplier', slug: 'supplier', approvalStatus: 'APPROVED' },
      vendor: { id: 'vendor-1', email: 'vendor@example.com', firstName: 'Vendor', lastName: 'User' },
      reviewedBy: null,
      catalogProduct: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  const service = new VendorSubmissionService(mockRepo);
  const created = await service.create(
    { id: 'vendor-1' },
    {
      title: 'Handmade Vase',
      vendorQuotedPrice: 45,
      stockAvailable: 10,
    }
  );

  assert.equal(created.title, 'Handmade Vase');
  assert.equal(created.vendorQuotedPrice, 45);
  assert.equal(created.status, 'SUBMITTED');

  assert.notEqual(service, vendorSubmissionService);
});
