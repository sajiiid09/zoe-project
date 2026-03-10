import { ValidationError } from '../utils/errors.js';

const optionalString = (value, fieldName, maxLength = 255) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalized = String(value).trim();
  if (normalized.length > maxLength) {
    throw new ValidationError(`${fieldName} is too long`);
  }

  return normalized;
};

const requiredString = (value, fieldName, maxLength = 255) => {
  const normalized = optionalString(value, fieldName, maxLength);
  if (!normalized) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return normalized;
};

const optionalBoolean = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  throw new ValidationError(`${fieldName} must be a boolean`);
};

const parseName = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError('name must be an object');
  }

  return {
    firstName: optionalString(value.firstName, 'name.firstName', 120),
    lastName: optionalString(value.lastName, 'name.lastName', 120),
  };
};

const parsePreferences = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError('preferences must be an object');
  }

  return value;
};

const validateAddressData = (body, { partial }) => {
  const fullName = partial
    ? optionalString(body.fullName, 'fullName', 120)
    : requiredString(body.fullName, 'fullName', 120);
  const line1 = partial
    ? optionalString(body.line1, 'line1', 255)
    : requiredString(body.line1, 'line1', 255);
  const line2 = optionalString(body.line2, 'line2', 255);
  const city = partial
    ? optionalString(body.city, 'city', 120)
    : requiredString(body.city, 'city', 120);
  const state = partial
    ? optionalString(body.state, 'state', 120)
    : requiredString(body.state, 'state', 120);
  const zipCode = partial
    ? optionalString(body.zipCode, 'zipCode', 32)
    : requiredString(body.zipCode, 'zipCode', 32);
  const country = partial
    ? optionalString(body.country, 'country', 120)
    : requiredString(body.country, 'country', 120);
  const phone = partial
    ? optionalString(body.phone, 'phone', 40)
    : requiredString(body.phone, 'phone', 40);

  return {
    fullName,
    line1,
    line2,
    city,
    state,
    zipCode,
    country,
    phone,
  };
};

export const updateUserProfileSchema = async (req) => ({
  body: {
    name: parseName(req.body.name),
    phone: optionalString(req.body.phone, 'phone', 40),
    preferences: parsePreferences(req.body.preferences),
  },
});

export const createUserAddressSchema = async (req) => {
  const addressData = validateAddressData(req.body, { partial: false });

  return {
    body: {
      label: optionalString(req.body.label, 'label', 80) || 'Other',
      type: optionalString(req.body.type, 'type', 40) || 'shipping',
      isDefault: optionalBoolean(req.body.isDefault, 'isDefault') ?? false,
      ...addressData,
    },
  };
};

export const updateUserAddressSchema = async (req) => {
  const addressData = validateAddressData(req.body, { partial: true });

  return {
    body: {
      label: optionalString(req.body.label, 'label', 80),
      type: optionalString(req.body.type, 'type', 40),
      isDefault: optionalBoolean(req.body.isDefault, 'isDefault'),
      ...addressData,
    },
    params: {
      addressId: requiredString(req.params.addressId, 'addressId', 64),
    },
  };
};
