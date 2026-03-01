import express from 'express';
import { requireAffiliate, requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createAffiliateProfile,
  getAffiliateProfile,
  updateAffiliateProfile,
} from '../controllers/affiliateController.js';
import {
  createAffiliateProfileSchema,
  updateAffiliateProfileSchema,
} from '../validators/affiliateValidators.js';

const router = express.Router();

router.use(requireAuth, requireAffiliate);

router.post('/profile', validate(createAffiliateProfileSchema), createAffiliateProfile);
router.get('/profile', getAffiliateProfile);
router.put('/profile', validate(updateAffiliateProfileSchema), updateAffiliateProfile);

export default router;
