import test from 'node:test';
import assert from 'node:assert/strict';

import { notFoundHandler } from '../../app.js';
import { createMockRequest, createMockResponse } from '../helpers/testUtils.js';

test('unknown routes return the standardized 404 response', async () => {
  const req = createMockRequest();
  const res = createMockResponse();

  await notFoundHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Route not found',
  });
});
