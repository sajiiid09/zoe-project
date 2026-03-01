import { ValidationError } from '../utils/errors.js';

const normalizeEmail = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ValidationError('Invalid payout email');
  }

  return normalized;
};

const normalizeString = (value, fieldName, { required = false, maxLength = 255 } = {}) => {
  if (value === undefined || value === null) {
    if (required) {
      throw new ValidationError(`${fieldName} is required`);
    }

    return undefined;
  }

  const normalized = String(value).trim();

  if (!normalized && required) {
    throw new ValidationError(`${fieldName} is required`);
  }

  if (normalized.length > maxLength) {
    throw new ValidationError(`${fieldName} is too long`);
  }

  return normalized;
};

export const createAffiliateProfileSchema = async (req) => ({
  body: {
    displayName: normalizeString(req.body.displayName, 'displayName', { required: true, maxLength: 120 }),
    referralCode: normalizeString(req.body.referralCode, 'referralCode', { required: true, maxLength: 60 }),
    bio: normalizeString(req.body.bio, 'bio', { maxLength: 500 }) || null,
    website: normalizeString(req.body.website, 'website', { maxLength: 255 }) || null,
    payoutEmail: normalizeEmail(req.body.payoutEmail),
  },
});

export const updateAffiliateProfileSchema = async (req) => ({
  body: {
    displayName: normalizeString(req.body.displayName, 'displayName', { maxLength: 120 }),
    bio: normalizeString(req.body.bio, 'bio', { maxLength: 500 }),
    website: normalizeString(req.body.website, 'website', { maxLength: 255 }),
    payoutEmail: normalizeEmail(req.body.payoutEmail),
  },
});
