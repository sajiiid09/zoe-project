import test from 'node:test';
import assert from 'node:assert/strict';

import { errorHandler } from '../../middleware/errorHandler.js';
import {
  createMockRequest,
  createMockResponse,
  patchMethod,
} from '../helpers/testUtils.js';

test('the global error handler returns a standardized 500 payload', async (t) => {
  const req = createMockRequest();
  const res = createMockResponse();
  const restoreConsoleError = patchMethod(console, 'error', () => {});

  t.after(() => {
    restoreConsoleError();
  });

  errorHandler(new Error('Exploded'), req, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, 'Exploded');
});
