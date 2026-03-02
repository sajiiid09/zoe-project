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

test('register budget does not consume login budget', async () => {
  const registerRoute = findRoute('/register', 'post');
  const loginRoute = findRoute('/login', 'post');
  assert.ok(registerRoute);
  assert.ok(loginRoute);

  const registerLimiter = registerRoute.stack[0].handle;
  const loginLimiter = loginRoute.stack[0].handle;

  for (let i = 0; i < 10; i++) {
    const req = createMockRequest({ ip: '203.0.113.40' });
    const res = createMockResponse();

    const { nextCalled } = await runLimiter(registerLimiter, req, res);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  }

  const loginReq = createMockRequest({ ip: '203.0.113.40' });
  const loginRes = createMockResponse();
  const { nextCalled } = await runLimiter(loginLimiter, loginReq, loginRes);

  assert.equal(nextCalled, true);
  assert.equal(loginRes.statusCode, 200);
  assert.equal(loginRes.body, null);
});

test('login budget does not consume register budget', async () => {
  const registerRoute = findRoute('/register', 'post');
  const loginRoute = findRoute('/login', 'post');
  assert.ok(registerRoute);
  assert.ok(loginRoute);

  const registerLimiter = registerRoute.stack[0].handle;
  const loginLimiter = loginRoute.stack[0].handle;

  for (let i = 0; i < 10; i++) {
    const req = createMockRequest({ ip: '198.51.100.40' });
    const res = createMockResponse();

    const { nextCalled } = await runLimiter(loginLimiter, req, res);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  }

  const registerReq = createMockRequest({ ip: '198.51.100.40' });
  const registerRes = createMockResponse();
  const { nextCalled } = await runLimiter(registerLimiter, registerReq, registerRes);

  assert.equal(nextCalled, true);
  assert.equal(registerRes.statusCode, 200);
  assert.equal(registerRes.body, null);
});

test('different scopes still independently block on their own 11th request', async () => {
  const registerRoute = findRoute('/register', 'post');
  const loginRoute = findRoute('/login', 'post');
  assert.ok(registerRoute);
  assert.ok(loginRoute);

  const registerLimiter = registerRoute.stack[0].handle;
  const loginLimiter = loginRoute.stack[0].handle;

  for (let i = 0; i < 10; i++) {
    const req = createMockRequest({ ip: '203.0.113.70' });
    const res = createMockResponse();

    const { nextCalled } = await runLimiter(registerLimiter, req, res);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  }

  const blockedRegisterReq = createMockRequest({ ip: '203.0.113.70' });
  const blockedRegisterRes = createMockResponse();
  const blockedRegister = await runLimiter(registerLimiter, blockedRegisterReq, blockedRegisterRes);

  assert.equal(blockedRegister.nextCalled, false);
  assert.equal(blockedRegisterRes.statusCode, 429);
  assert.equal(blockedRegisterRes.body.success, false);

  const freshLoginReq = createMockRequest({ ip: '203.0.113.70' });
  const freshLoginRes = createMockResponse();
  const freshLogin = await runLimiter(loginLimiter, freshLoginReq, freshLoginRes);

  assert.equal(freshLogin.nextCalled, true);
  assert.equal(freshLoginRes.statusCode, 200);
  assert.equal(freshLoginRes.body, null);
});
