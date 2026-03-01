import { sendSuccess } from '../utils/apiResponse.js';
import { affiliateProfileService } from '../services/affiliateProfileService.js';
import { asyncHandler } from '../middleware/authMiddleware.js';

export const createAffiliateProfile = asyncHandler(async (req, res) => {
  const profile = await affiliateProfileService.createProfile(req.user, req.body);
  return sendSuccess(res, profile, 'Affiliate profile created successfully', 201);
});

export const getAffiliateProfile = asyncHandler(async (req, res) => {
  const profile = await affiliateProfileService.getProfile(req.user.id);
  return sendSuccess(res, profile);
});

export const updateAffiliateProfile = asyncHandler(async (req, res) => {
  const profile = await affiliateProfileService.updateProfile(req.user.id, req.body);
  return sendSuccess(res, profile, 'Affiliate profile updated successfully');
});
