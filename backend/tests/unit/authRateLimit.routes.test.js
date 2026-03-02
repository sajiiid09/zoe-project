import test from 'node:test';
import assert from 'node:assert/strict';

import { createApp } from '../../app.js';
import userRoutes from '../../routes/userRoutes.js';
import { createMockRequest, createMockResponse } from '../helpers/testUtils.js';

const findRoute = (path, method) => userRoutes.stack.find((layer) =>
  layer?.route?.path === path && layer.route.methods?.[method]
)?.route;

const runLimiter = async (limiter, req, res) => {
  let nextCalled = false;

  limiter(req, res, () => {
    nextCalled = true;
  });

  return { nextCalled };
};

test('createApp enables trust proxy for single trusted proxy hop', () => {
  const app = createApp();

  assert.equal(app.get('trust proxy'), 1);
});

test('11th login request from same ip is rate limited with 429', async () => {
  const loginRoute = findRoute('/login', 'post');
  assert.ok(loginRoute);

  const limiter = loginRoute.stack[0].handle;

  for (let i = 0; i < 10; i++) {
    const req = createMockRequest({ ip: '203.0.113.10' });
    const res = createMockResponse();

    const { nextCalled } = await runLimiter(limiter, req, res);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, null);
  }

  const blockedReq = createMockRequest({ ip: '203.0.113.10' });
  const blockedRes = createMockResponse();

  const { nextCalled } = await runLimiter(limiter, blockedReq, blockedRes);

  assert.equal(nextCalled, false);
  assert.equal(blockedRes.statusCode, 429);
  assert.equal(blockedRes.body.success, false);
  assert.equal(blockedRes.body.message, 'Too many requests, please try again later');
});

test('11th register request from same ip is rate limited with 429', async () => {
  const registerRoute = findRoute('/register', 'post');
  assert.ok(registerRoute);

  const limiter = registerRoute.stack[0].handle;

  for (let i = 0; i < 10; i++) {
    const req = createMockRequest({ ip: '198.51.100.12' });
    const res = createMockResponse();

    const { nextCalled } = await runLimiter(limiter, req, res);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, null);
  }

  const blockedReq = createMockRequest({ ip: '198.51.100.12' });
  const blockedRes = createMockResponse();

  const { nextCalled } = await runLimiter(limiter, blockedReq, blockedRes);

  assert.equal(nextCalled, false);
  assert.equal(blockedRes.statusCode, 429);
  assert.equal(blockedRes.body.success, false);
  assert.equal(blockedRes.body.message, 'Too many requests, please try again later');
});
