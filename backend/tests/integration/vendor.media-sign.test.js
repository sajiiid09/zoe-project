import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../../config/db.js';
import { signVendorMediaUpload } from '../../controllers/vendorController.js';
import { requireAuth, requireVendor } from '../../middleware/authMiddleware.js';
import {
  createAuthToken,
  createMockRequest,
  createMockResponse,
  patchMethod,
  runHandler,
} from '../helpers/testUtils.js';

const snapshotCloudinaryEnv = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

const restoreCloudinaryEnv = (snapshot) => {
  if (snapshot.cloudName === undefined) {
    delete process.env.CLOUDINARY_CLOUD_NAME;
  } else {
    process.env.CLOUDINARY_CLOUD_NAME = snapshot.cloudName;
  }

  if (snapshot.apiKey === undefined) {
    delete process.env.CLOUDINARY_API_KEY;
  } else {
    process.env.CLOUDINARY_API_KEY = snapshot.apiKey;
  }

  if (snapshot.apiSecret === undefined) {
    delete process.env.CLOUDINARY_API_SECRET;
  } else {
    process.env.CLOUDINARY_API_SECRET = snapshot.apiSecret;
  }
};

test('vendor media sign route returns a signed payload for authenticated vendors', async (t) => {
  const previousEnv = snapshotCloudinaryEnv();
  process.env.CLOUDINARY_CLOUD_NAME = 'demo-cloud';
  process.env.CLOUDINARY_API_KEY = 'demo-key';
  process.env.CLOUDINARY_API_SECRET = 'demo-secret';

  t.after(() => {
    restoreCloudinaryEnv(previousEnv);
  });

  const vendorUser = {
    id: 'vendor-1',
    role: 'VENDOR',
    isActive: true,
    addresses: [],
  };

  const restoreUserLookup = patchMethod(prisma.user, 'findUnique', async () => vendorUser);
  t.after(() => restoreUserLookup());

  const headers = { authorization: `Bearer ${createAuthToken(vendorUser.id)}` };
  const req = createMockRequest({
    headers,
    body: {
      scope: 'product',
      filename: 'Desk Lamp.png',
    },
  });
  const res = createMockResponse();

  await runHandler(requireAuth, req, res);
  await runHandler(requireVendor, req, res);
  await runHandler(signVendorMediaUpload, req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.cloudName, 'demo-cloud');
  assert.equal(res.body.data.apiKey, 'demo-key');
  assert.match(res.body.data.folder, /zoe-market\/vendors\/vendor-1\/products/);
  assert.match(res.body.data.publicId, /^product-/);
  assert.equal(
    res.body.data.uploadUrl,
    'https://api.cloudinary.com/v1_1/demo-cloud/image/upload'
  );
});

test('vendor media sign route rejects non-vendor users', async (t) => {
  const customerUser = {
    id: 'customer-1',
    role: 'CUSTOMER',
    isActive: true,
    addresses: [],
  };

  const restoreUserLookup = patchMethod(prisma.user, 'findUnique', async () => customerUser);
  t.after(() => restoreUserLookup());

  const headers = { authorization: `Bearer ${createAuthToken(customerUser.id)}` };
  const req = createMockRequest({
    headers,
    body: {
      scope: 'product',
      filename: 'Desk Lamp.png',
    },
  });
  const res = createMockResponse();

  await runHandler(requireAuth, req, res);
  await runHandler(requireVendor, req, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.code, 'FORBIDDEN');
});

test('vendor media sign route rejects invalid scope values', async (t) => {
  const previousEnv = snapshotCloudinaryEnv();
  process.env.CLOUDINARY_CLOUD_NAME = 'demo-cloud';
  process.env.CLOUDINARY_API_KEY = 'demo-key';
  process.env.CLOUDINARY_API_SECRET = 'demo-secret';

  t.after(() => {
    restoreCloudinaryEnv(previousEnv);
  });

  const vendorUser = {
    id: 'vendor-1',
    role: 'VENDOR',
    isActive: true,
    addresses: [],
  };

  const restoreUserLookup = patchMethod(prisma.user, 'findUnique', async () => vendorUser);
  t.after(() => restoreUserLookup());

  const headers = { authorization: `Bearer ${createAuthToken(vendorUser.id)}` };
  const req = createMockRequest({
    headers,
    body: {
      scope: 'unknown',
      filename: 'Desk Lamp.png',
    },
  });
  const res = createMockResponse();

  await runHandler(requireAuth, req, res);
  await runHandler(requireVendor, req, res);
  await runHandler(signVendorMediaUpload, req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.code, 'VALIDATION_ERROR');
  assert.equal(
    res.body.message,
    'scope must be product, submission, store_logo, or store_banner'
  );
});

test('vendor media sign route returns a config error when Cloudinary env is missing', async (t) => {
  const previousEnv = snapshotCloudinaryEnv();
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  t.after(() => {
    restoreCloudinaryEnv(previousEnv);
  });

  const vendorUser = {
    id: 'vendor-1',
    role: 'VENDOR',
    isActive: true,
    addresses: [],
  };

  const restoreUserLookup = patchMethod(prisma.user, 'findUnique', async () => vendorUser);
  t.after(() => restoreUserLookup());

  const headers = { authorization: `Bearer ${createAuthToken(vendorUser.id)}` };
  const req = createMockRequest({
    headers,
    body: {
      scope: 'product',
      filename: 'Desk Lamp.png',
    },
  });
  const res = createMockResponse();

  await runHandler(requireAuth, req, res);
  await runHandler(requireVendor, req, res);
  await runHandler(signVendorMediaUpload, req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'CONFIG_ERROR');
});
