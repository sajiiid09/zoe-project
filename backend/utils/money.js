import { ValidationError } from './errors.js';

export const roundCurrency = (value) => {
  const number = Number(value);
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

export const ensurePositiveAmount = (value, fieldName = 'amount') => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new ValidationError(`${fieldName} must be greater than zero`);
  }

  return roundCurrency(number);
};

export const ensureNonNegativeAmount = (value, fieldName = 'amount') => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new ValidationError(`${fieldName} must be zero or greater`);
  }

  return roundCurrency(number);
};

export const ensureNonNegativeInteger = (value, fieldName = 'value') => {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative integer`);
  }

  return number;
};

export const calculateMargin = ({
  retailUnitPrice,
  vendorPayoutUnitPrice = 0,
  affiliateCommissionUnit = 0,
}) => {
  const margin = roundCurrency(
    Number(retailUnitPrice) - Number(vendorPayoutUnitPrice) - Number(affiliateCommissionUnit)
  );

  if (margin < 0) {
    throw new ValidationError('Platform margin cannot be negative');
  }

  return margin;
};
