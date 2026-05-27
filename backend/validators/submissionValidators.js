import { ValidationError } from '../utils/errors.js';

const APPROVED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'a.nooncdn.com',
  'cdn.britannica.com',
  'res.cloudinary.com',
]);

const isApprovedImageUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && APPROVED_IMAGE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
};

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

const optionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }

  return number;
};

const imagesArray = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new ValidationError('images must be an array');
  }

  const normalizedImages = value.map((item) => {
    if (typeof item !== 'string') {
      throw new ValidationError('images must contain only non-empty URL strings');
    }

    const normalized = item.trim();
    if (!normalized) {
      throw new ValidationError('images must contain only non-empty URL strings');
    }

    if (!isApprovedImageUrl(normalized)) {
      throw new ValidationError('image URL host is not allowed');
    }

    return normalized;
  });

  return normalizedImages;
};

export const createSubmissionSchema = async (req) => ({
  body: {
    title: requiredString(req.body.title, 'title', 200),
    description: optionalString(req.body.description, 'description', 2000) || null,
    category: optionalString(req.body.category, 'category', 120) || null,
    vendorQuotedPrice: optionalNumber(req.body.vendorQuotedPrice, 'vendorQuotedPrice'),
    suggestedRetailPrice: optionalNumber(req.body.suggestedRetailPrice, 'suggestedRetailPrice'),
    stockAvailable: optionalNumber(req.body.stockAvailable, 'stockAvailable') ?? 0,
    currency: optionalString(req.body.currency, 'currency', 10) || 'usd',
    images: imagesArray(req.body.images) || [],
  },
});

export const updateSubmissionSchema = async (req) => ({
  body: {
    title: optionalString(req.body.title, 'title', 200),
    description: optionalString(req.body.description, 'description', 2000),
    category: optionalString(req.body.category, 'category', 120),
    vendorQuotedPrice: optionalNumber(req.body.vendorQuotedPrice, 'vendorQuotedPrice'),
    suggestedRetailPrice:
      req.body.suggestedRetailPrice === null
        ? null
        : optionalNumber(req.body.suggestedRetailPrice, 'suggestedRetailPrice'),
    stockAvailable: optionalNumber(req.body.stockAvailable, 'stockAvailable'),
    images: imagesArray(req.body.images),
  },
});

export const acceptSubmissionSchema = async (req) => ({
  body: {
    retailPrice: optionalNumber(req.body.retailPrice, 'retailPrice'),
    title: optionalString(req.body.title, 'title', 200),
    description: optionalString(req.body.description, 'description', 2000),
    category: optionalString(req.body.category, 'category', 120),
    stock: optionalNumber(req.body.stock, 'stock'),
    status: optionalString(req.body.status, 'status', 40) || 'ACTIVE',
    isFeatured: Boolean(req.body.isFeatured),
    images: imagesArray(req.body.images),
  },
});

export const rejectSubmissionSchema = async (req) => ({
  body: {
    reason: optionalString(req.body.reason, 'reason', 500) || null,
  },
});

export const updateCatalogProductSchema = async (req) => ({
  body: {
    title: optionalString(req.body.title, 'title', 200),
    description: optionalString(req.body.description, 'description', 2000),
    category: optionalString(req.body.category, 'category', 120),
    retailPrice: optionalNumber(req.body.retailPrice, 'retailPrice'),
    stock: optionalNumber(req.body.stock, 'stock'),
    isFeatured:
      req.body.isFeatured === undefined ? undefined : Boolean(req.body.isFeatured),
  },
});

export const updateCatalogStatusSchema = async (req) => {
  const status = optionalString(req.body.status, 'status', 40);

  if (!['DRAFT', 'ACTIVE', 'DISCONTINUED'].includes(status)) {
    throw new ValidationError('status must be DRAFT, ACTIVE, or DISCONTINUED');
  }

  return {
    body: {
      status,
    },
  };
};
