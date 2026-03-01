import crypto from 'crypto';

const DEFAULT_ATTRIBUTION_WINDOW_DAYS = 30;

export const generateReferralToken = () => crypto.randomBytes(24).toString('hex');

export const getAttributionWindowMs = (days = DEFAULT_ATTRIBUTION_WINDOW_DAYS) =>
  days * 24 * 60 * 60 * 1000;

export const isWithinAttributionWindow = (clickedAt, days = DEFAULT_ATTRIBUTION_WINDOW_DAYS) => {
  if (!clickedAt) {
    return false;
  }

  const clickedAtDate = new Date(clickedAt);

  if (Number.isNaN(clickedAtDate.getTime())) {
    return false;
  }

  return Date.now() - clickedAtDate.getTime() <= getAttributionWindowMs(days);
};

export const buildReferralCookieValue = ({ linkId, catalogProductId, affiliateId, issuedAt }) =>
  JSON.stringify({
    linkId,
    catalogProductId,
    affiliateId,
    issuedAt: issuedAt || new Date().toISOString(),
  });
