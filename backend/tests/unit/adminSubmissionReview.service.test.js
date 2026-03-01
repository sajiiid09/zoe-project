import test from 'node:test';
import assert from 'node:assert/strict';

import { AdminSubmissionService } from '../../services/adminSubmissionService.js';

test('admin submission review service returns catalog product and payout agreement on acceptance', async () => {
  const mockSubmissionRepo = {
    findById: async () => ({
      id: 'submission-1',
      vendorId: 'vendor-1',
      title: 'Handmade Vase',
      description: 'A beautiful vase',
      category: 'Decor',
      vendorQuotedPrice: 60,
      currency: 'usd',
      stockAvailable: 8,
      images: [],
      status: 'SUBMITTED',
    }),
    acceptSubmission: async () => ({
      submission: {
        id: 'submission-1',
        vendorQuotedPrice: 60,
        suggestedRetailPrice: null,
      },
      catalogProduct: {
        id: 'catalog-1',
        retailPrice: 95,
      },
      supplyAgreement: {
        id: 'agreement-1',
        agreedPayoutAmount: 60,
      },
    }),
  };

  const service = new AdminSubmissionService(mockSubmissionRepo);
  const result = await service.acceptSubmission(
    { id: 'admin-1' },
    'submission-1',
    { retailPrice: 95 }
  );

  assert.equal(result.catalogProduct.retailPrice, 95);
  assert.equal(result.supplyAgreement.agreedPayoutAmount, 60);
});
