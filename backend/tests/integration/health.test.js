import test from 'node:test';
import assert from 'node:assert/strict';

import { healthHandler } from '../../app.js';
import { createMockRequest, createMockResponse } from '../helpers/testUtils.js';

test('GET /api/health returns the expected health payload', async () => {
  const req = createMockRequest();
  const res = createMockResponse();

  await healthHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.message, 'Server is running');
  assert.equal(res.body.data.status, 'OK');
  assert.ok(res.body.data.timestamp);
});
