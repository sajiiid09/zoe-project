import test from 'node:test';
import assert from 'node:assert/strict';

import { startServer } from '../../server.js';

test('startServer throws when JWT_SECRET is not set', () => {
  const previousSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  assert.throws(
    () => startServer(),
    /JWT_SECRET environment variable is required/
  );

  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});
