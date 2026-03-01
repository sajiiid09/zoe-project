import test from 'node:test';
import assert from 'node:assert/strict';

import { validate } from '../../middleware/validate.js';
import {
  createMockRequest,
  createMockResponse,
  runHandler,
  runMiddleware,
} from '../helpers/testUtils.js';

test('validate middleware normalizes successful validation output', async () => {
  const req = createMockRequest({
    body: { name: '  Decormade  ' },
  });
  const res = createMockResponse();

  const result = await runMiddleware(
    validate(async (request) => ({
      body: {
        name: String(request.body.name).trim(),
      },
    })),
    req,
    res
  );

  assert.equal(result.nextCalled, true);
  assert.equal(result.nextError, null);
  assert.equal(req.body.name, 'Decormade');
  assert.deepEqual(req.validated, {
    body: {
      name: 'Decormade',
    },
  });
});

test('validate middleware returns a 400 payload on validation errors', async () => {
  const req = createMockRequest({ body: {} });
  const res = createMockResponse();

  await runHandler(
    validate(async () => {
      throw new Error('name is required');
    }),
    req,
    res
  );

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.code, 'VALIDATION_ERROR');
  assert.equal(res.body.message, 'name is required');
});
