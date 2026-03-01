import test from 'node:test';
import assert from 'node:assert/strict';

import { sendError, sendSuccess } from '../../utils/apiResponse.js';

const createMockResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test('sendSuccess builds a standardized success payload', () => {
  const res = createMockResponse();
  sendSuccess(res, { id: '1' }, 'Created', 201);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, {
    success: true,
    message: 'Created',
    data: { id: '1' },
  });
});

test('sendError builds a standardized error payload', () => {
  const res = createMockResponse();
  sendError(res, 'Bad request', 400, { field: 'name' }, 'VALIDATION_ERROR');

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: 'Bad request',
    code: 'VALIDATION_ERROR',
    details: { field: 'name' },
  });
});
