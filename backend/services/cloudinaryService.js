import { v2 as cloudinary } from 'cloudinary';

import { AppError, ValidationError } from '../utils/errors.js';

const SCOPE_CONFIG = {
  product: {
    folderSuffix: 'products',
    publicIdPrefix: 'product',
  },
  submission: {
    folderSuffix: 'submissions',
    publicIdPrefix: 'submission',
  },
  store_logo: {
    folderSuffix: 'store',
    publicIdPrefix: 'logo',
  },
  store_banner: {
    folderSuffix: 'store',
    publicIdPrefix: 'banner',
  },
};

const readConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
};

const ensureConfigured = () => {
  const config = readConfig();

  if (!config) {
    throw new AppError(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env.',
      503,
      'CONFIG_ERROR'
    );
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  return config;
};

const sanitizeBaseName = (value = 'image') =>
  value
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'image';

const resolveScopeConfig = (scope) => {
  const config = SCOPE_CONFIG[scope];

  if (!config) {
    throw new ValidationError('scope must be product, submission, store_logo, or store_banner');
  }

  return config;
};

const buildPublicId = ({ vendorId, scope, filename }) => {
  const config = resolveScopeConfig(scope);
  const basename = sanitizeBaseName(filename);
  const stamp = Date.now().toString(36);

  return {
    folder: `zoe-market/vendors/${vendorId}/${config.folderSuffix}`,
    publicId: `${config.publicIdPrefix}-${stamp}-${basename}`,
  };
};

const createVendorUploadSignature = ({ vendorId, scope, filename }) => {
  const { cloudName, apiKey, apiSecret } = ensureConfigured();
  const { folder, publicId } = buildPublicId({ vendorId, scope, filename });
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    apiSecret
  );

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
};

export const cloudinaryService = {
  isConfigured: () => Boolean(readConfig()),
  createVendorUploadSignature,
};
