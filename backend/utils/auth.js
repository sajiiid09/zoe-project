const AUTH_COOKIE_NAME = 'zoe_market_session';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

const JWT_SECRET_ERROR_MESSAGE = 'JWT_SECRET environment variable is required';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error(JWT_SECRET_ERROR_MESSAGE);
  }

  return secret;
};

export const assertJwtSecretConfigured = () => {
  getJwtSecret();
};

const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: TOKEN_EXPIRY_SECONDS * 1000,
});

const clearAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions());
};

export const parseCookieHeader = (rawCookie = '') => {
  if (!rawCookie) {
    return {};
  }

  return rawCookie.split(';').reduce((acc, pair) => {
    const [rawKey, ...rawValueParts] = pair.split('=');
    const key = rawKey?.trim();

    if (!key) {
      return acc;
    }

    const value = rawValueParts.join('=').trim();
    try {
      acc[key] = decodeURIComponent(value);
    } catch {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const readAuthTokenFromRequest = (req) => {
  const cookies = parseCookieHeader(req.headers?.cookie);
  const cookieToken = cookies[AUTH_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const header = req.headers?.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length).trim() || null;
};
