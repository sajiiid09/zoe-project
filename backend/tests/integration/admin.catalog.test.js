import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import {
  getCatalogProduct,
  listCatalogProducts,
  updateCatalogProduct,
  updateCatalogProductStatus,
} from '../../controllers/adminCatalogController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { catalogService } from '../../services/catalogService.js';
import {
  updateCatalogProductSchema,
  updateCatalogStatusSchema,
} from '../../validators/submissionValidators.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

test('admin catalog routes manage CatalogProduct records', async (t) => {
  const adminUser = {
    id: 'admin-1',
    role: 'ADMIN',
    isActive: true,
    addresses: [],
  };

  const restores = [
    patchMethod(prisma.user, 'findUnique', async () => adminUser),
    patchMethod(catalogService, 'listAll', async () => [{ id: 'catalog-1', retailPrice: 95 }]),
    patchMethod(catalogService, 'getById', async () => ({ id: 'catalog-1', retailPrice: 95 })),
    patchMethod(catalogService, 'update', async () => ({ id: 'catalog-1', retailPrice: 100 })),
    patchMethod(catalogService, 'updateStatus', async () => ({ id: 'catalog-1', status: 'ACTIVE', retailPrice: 95 })),
  ];

  t.after(() => {
    restores.reverse().forEach((restore) => restore());
  });

  const headers = { authorization: `Bearer ${createAuthToken(adminUser.id)}` };

  const listReq = createMockRequest({ headers });
  const listRes = createMockResponse();
  await runHandler(requireAuth, listReq, listRes);
  await runHandler(requireAdmin, listReq, listRes);
  await runHandler(listCatalogProducts, listReq, listRes);
  assert.equal(listRes.body.data.length, 1);

  const getReq = createMockRequest({
    headers,
    params: { id: 'catalog-1' },
  });
  const getRes = createMockResponse();
  await runHandler(requireAuth, getReq, getRes);
  await runHandler(requireAdmin, getReq, getRes);
  await runHandler(getCatalogProduct, getReq, getRes);
  assert.equal(getRes.body.data.id, 'catalog-1');

  const updateReq = createMockRequest({
    headers,
    params: { id: 'catalog-1' },
    body: { retailPrice: 100 },
  });
  const updateRes = createMockResponse();
  await runHandler(requireAuth, updateReq, updateRes);
  await runHandler(requireAdmin, updateReq, updateRes);
  await runHandler(validate(updateCatalogProductSchema), updateReq, updateRes);
  await runHandler(updateCatalogProduct, updateReq, updateRes);
  assert.equal(updateRes.body.data.retailPrice, 100);

  const statusReq = createMockRequest({
    headers,
    params: { id: 'catalog-1' },
    body: { status: 'ACTIVE' },
  });
  const statusRes = createMockResponse();
  await runHandler(requireAuth, statusReq, statusRes);
  await runHandler(requireAdmin, statusReq, statusRes);
  await runHandler(validate(updateCatalogStatusSchema), statusReq, statusRes);
  await runHandler(updateCatalogProductStatus, statusReq, statusRes);
  assert.equal(statusRes.body.data.status, 'ACTIVE');
});
