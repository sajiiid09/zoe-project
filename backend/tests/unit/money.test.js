import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateMargin,
  ensureNonNegativeAmount,
  ensureNonNegativeInteger,
  ensurePositiveAmount,
  roundCurrency,
} from '../../utils/money.js';

test('money helpers normalize and validate currency values', () => {
  assert.equal(roundCurrency(1.005), 1.01);
  assert.equal(ensurePositiveAmount('12.5'), 12.5);
  assert.equal(ensureNonNegativeAmount('0'), 0);
  assert.equal(ensureNonNegativeInteger(3), 3);
  assert.equal(
    calculateMargin({
      retailUnitPrice: 100,
      vendorPayoutUnitPrice: 70,
      affiliateCommissionUnit: 5,
    }),
    25
  );
});

test('money helpers reject invalid negative values', () => {
  assert.throws(() => ensurePositiveAmount(0), /greater than zero/);
  assert.throws(() => ensureNonNegativeInteger(2.5), /non-negative integer/);
  assert.throws(
    () =>
      calculateMargin({
        retailUnitPrice: 10,
        vendorPayoutUnitPrice: 8,
        affiliateCommissionUnit: 5,
      }),
    /cannot be negative/
  );
});
