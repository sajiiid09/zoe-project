import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import {
  acceptAdminSubmission,
  getAdminSubmission,
  listAdminSubmissions,
  rejectAdminSubmission,
} from '../../controllers/adminSubmissionController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { adminSubmissionService } from '../../services/adminSubmissionService.js';
import {
  acceptSubmissionSchema,
  rejectSubmissionSchema,
} from '../../validators/submissionValidators.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('admin submission routes list, inspect, accept, and reject submissions', async (t) => {
  const adminUser = {
    id: 'admin-1',
    role: 'ADMIN',
    isActive: true,
    addresses: [],
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => adminUser),
    patchMethod(adminSubmissionService, 'listSubmissions', async () => [{ id: 'submission-1' }]),
    patchMethod(adminSubmissionService, 'getSubmission', async () => ({ id: 'submission-1' })),
    patchMethod(adminSubmissionService, 'acceptSubmission', async () => ({
      submission: { id: 'submission-1' },
      catalogProduct: { id: 'catalog-1', retailPrice: 95 },
      supplyAgreement: { id: 'agreement-1', agreedPayoutAmount: 60 },
    })),
    patchMethod(adminSubmissionService, 'rejectSubmission', async () => ({ id: 'submission-1', status: 'REJECTED' })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = { authorization: `Bearer ${createAuthToken(adminUser.id)}` };

  const listReq = createMockRequest({ headers });
  const listRes = createMockResponse();
  await runHandler(requireAuth, listReq, listRes);
  await runHandler(requireAdmin, listReq, listRes);
  await runHandler(listAdminSubmissions, listReq, listRes);
  assert.equal(listRes.body.data.length, 1);

  const getReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
  });
  const getRes = createMockResponse();
  await runHandler(requireAuth, getReq, getRes);
  await runHandler(requireAdmin, getReq, getRes);
  await runHandler(getAdminSubmission, getReq, getRes);
  assert.equal(getRes.body.data.id, 'submission-1');

  const acceptReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
    body: { retailPrice: 95 },
  });
  const acceptRes = createMockResponse();
  await runHandler(requireAuth, acceptReq, acceptRes);
  await runHandler(requireAdmin, acceptReq, acceptRes);
  await runHandler(validate(acceptSubmissionSchema), acceptReq, acceptRes);
  await runHandler(acceptAdminSubmission, acceptReq, acceptRes);
  assert.equal(acceptRes.body.data.catalogProduct.id, 'catalog-1');

  const rejectReq = createMockRequest({
    headers,
    params: { id: 'submission-1' },
    body: { reason: 'Not a fit' },
  });
  const rejectRes = createMockResponse();
  await runHandler(requireAuth, rejectReq, rejectRes);
  await runHandler(requireAdmin, rejectReq, rejectRes);
  await runHandler(validate(rejectSubmissionSchema), rejectReq, rejectRes);
  await runHandler(rejectAdminSubmission, rejectReq, rejectRes);
  assert.equal(rejectRes.body.data.status, 'REJECTED');
});
