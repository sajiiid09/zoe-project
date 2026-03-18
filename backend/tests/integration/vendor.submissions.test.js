import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import {
  createSubmission,
  deleteMySubmission,
  getMySubmission,
  listMySubmissions,
  updateMySubmission,
} from '../../controllers/vendorSubmissionController.js';
import { requireAuth, requireVendor } from '../../middleware/authMiddleware.js';
import { vendorSubmissionService } from '../../services/vendorSubmissionService.js';
import { validate } from '../../middleware/validate.js';
import {
  createSubmissionSchema,
  updateSubmissionSchema,
} from '../../validators/submissionValidators.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('vendor submission routes support CRUD for the authenticated vendor', async (t) => {
  const vendorUser = {
    id: 'vendor-1',
    role: 'VENDOR',
    isActive: true,
    addresses: [],
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => vendorUser),
    patchMethod(vendorSubmissionService, 'create', async () => ({ id: 'submission-1', title: 'Handmade Vase' })),
    patchMethod(vendorSubmissionService, 'listForVendor', async () => [{ id: 'submission-1', title: 'Handmade Vase' }]),
    patchMethod(vendorSubmissionService, 'getForVendor', async () => ({ id: 'submission-1', title: 'Handmade Vase' })),
    patchMethod(vendorSubmissionService, 'updateForVendor', async () => ({ id: 'submission-1', title: 'Updated Vase' })),
    patchMethod(vendorSubmissionService, 'deleteForVendor', async () => ({ deleted: true })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = { authorization: `Bearer ${createAuthToken(vendorUser.id)}` };

  const createReq = createMockRequest({
    headers,
    body: {
      title: 'Handmade Vase',
      vendorQuotedPrice: 45,
      stockAvailable: 10,
    },
  });
  const createRes = createMockResponse();
  await runHandler(requireAuth, createReq, createRes);
  await runHandler(requireVendor, createReq, createRes);
  await runHandler(validate(createSubmissionSchema), createReq, createRes);
  await runHandler(createSubmission, createReq, createRes);
  assert.equal(createRes.statusCode, 201);

  const listReq = createMockRequest({ headers });
  const listRes = createMockResponse();
  await runHandler(requireAuth, listReq, listRes);
  await runHandler(requireVendor, listReq, listRes);
  await runHandler(listMySubmissions, listReq, listRes);
  assert.equal(listRes.body.data.length, 1);

  const getReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
  });
  const getRes = createMockResponse();
  await runHandler(requireAuth, getReq, getRes);
  await runHandler(requireVendor, getReq, getRes);
  await runHandler(getMySubmission, getReq, getRes);
  assert.equal(getRes.body.data.id, 'submission-1');

  const updateReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
    body: { title: 'Updated Vase' },
  });
  const updateRes = createMockResponse();
  await runHandler(requireAuth, updateReq, updateRes);
  await runHandler(requireVendor, updateReq, updateRes);
  await runHandler(validate(updateSubmissionSchema), updateReq, updateRes);
  await runHandler(updateMySubmission, updateReq, updateRes);
  assert.equal(updateRes.body.data.title, 'Updated Vase');

  const deleteReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
  });
  const deleteRes = createMockResponse();
  await runHandler(requireAuth, deleteReq, deleteRes);
  await runHandler(requireVendor, deleteReq, deleteRes);
  await runHandler(deleteMySubmission, deleteReq, deleteRes);
  assert.equal(deleteRes.body.success, true);
});

test('create submission validation rejects disallowed and malformed image URLs', async () => {
  const disallowedHostReq = createMockRequest({
    body: {
      title: 'Handmade Vase',
      vendorQuotedPrice: 45,
      stockAvailable: 10,
      images: ['https://example.com/image.jpg'],
    },
  });
  const disallowedHostRes = createMockResponse();
  await runHandler(validate(createSubmissionSchema), disallowedHostReq, disallowedHostRes);
  assert.equal(disallowedHostRes.statusCode, 400);
  assert.equal(disallowedHostRes.body.code, 'VALIDATION_ERROR');
  assert.equal(disallowedHostRes.body.message, 'image URL host is not allowed');

  const malformedUrlReq = createMockRequest({
    body: {
      title: 'Handmade Vase',
      vendorQuotedPrice: 45,
      stockAvailable: 10,
      images: ['not-a-url'],
    },
  });
  const malformedUrlRes = createMockResponse();
  await runHandler(validate(createSubmissionSchema), malformedUrlReq, malformedUrlRes);
  assert.equal(malformedUrlRes.statusCode, 400);
  assert.equal(malformedUrlRes.body.code, 'VALIDATION_ERROR');
  assert.equal(malformedUrlRes.body.message, 'image URL host is not allowed');
});
