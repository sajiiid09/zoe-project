import jwt from 'jsonwebtoken';

import { errorHandler } from '../../middleware/errorHandler.js';

const TEST_JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export const createAuthToken = (userId = 'test-user-id') =>
  jwt.sign({ userId }, TEST_JWT_SECRET, { expiresIn: '1h' });

export const createMockRequest = ({
  body = {},
  params = {},
  query = {},
  headers = {},
  user = null,
  ip = '127.0.0.1',
} = {}) => ({
  body,
  params,
  query,
  headers,
  user,
  ip,
  validated: undefined,
});

export const createMockResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
    headers: {},
    cookies: [],
    redirectUrl: null,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      this.headersSent = true;
      return this;
    },
    send(payload) {
      this.body = payload;
      this.headersSent = true;
      return this;
    },
    cookie(name, value, options = {}) {
      this.cookies.push({ name, value, options });
      return this;
    },
    set(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    redirect(statusOrUrl, maybeUrl) {
      if (typeof statusOrUrl === 'number') {
        this.statusCode = statusOrUrl;
        this.redirectUrl = maybeUrl;
      } else {
        this.statusCode = 302;
        this.redirectUrl = statusOrUrl;
      }

      this.headersSent = true;
      return this;
    },
  };

  return response;
};

export const patchMethod = (object, methodName, implementation) => {
  const original = object[methodName];
  object[methodName] = implementation;

  return () => {
    object[methodName] = original;
  };
};

export const runMiddleware = async (middleware, req, res = createMockResponse()) => {
  let nextCalled = false;
  let nextError = null;

  await new Promise((resolve, reject) => {
    const next = (error) => {
      nextCalled = true;
      nextError = error || null;
      resolve();
    };

    Promise.resolve(middleware(req, res, next)).then(resolve).catch(reject);
  });

  return { req, res, nextCalled, nextError };
};

export const runHandler = async (handler, req, res = createMockResponse()) => {
  const { nextError } = await runMiddleware(handler, req, res);

  if (nextError) {
    await new Promise((resolve, reject) => {
      const fallbackNext = (error) => {
        reject(error || new Error('Unexpected next() call from error handler'));
      };

      try {
        errorHandler(nextError, req, res, fallbackNext);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { req, res };
};
