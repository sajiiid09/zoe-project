import { sendSuccess } from '../utils/apiResponse.js';
import { affiliateProfileService } from '../services/affiliateProfileService.js';
import { asyncHandler } from '../middleware/authMiddleware.js';

export const getAffiliates = asyncHandler(async (req, res) => {
  const profiles = await affiliateProfileService.listProfiles();
  return sendSuccess(res, profiles);
});

export const approveAffiliateProfile = asyncHandler(async (req, res) => {
  const profile = await affiliateProfileService.approveProfile(req.params.affiliateProfileId);
  return sendSuccess(res, profile, 'Affiliate profile approved successfully');
});

export const rejectAffiliateProfile = asyncHandler(async (req, res) => {
  const profile = await affiliateProfileService.rejectProfile(
    req.params.affiliateProfileId,
    req.body.reason
  );
  return sendSuccess(res, profile, 'Affiliate profile rejected successfully');
});
