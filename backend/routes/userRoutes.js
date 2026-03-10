import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserOrdersSummary,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getVendors,
  approveVendorStore,
  rejectVendorStore,
} from '../controllers/userController.js';
import {
  getAffiliates,
  approveAffiliateProfile,
  rejectAffiliateProfile,
} from '../controllers/adminAffiliateController.js';
import { requireAuth, requireAdmin, rateLimit } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createUserAddressSchema,
  updateUserAddressSchema,
  updateUserProfileSchema,
} from '../validators/userValidators.js';

const router = express.Router();

// Public routes
router.post('/register', rateLimit(10, 15 * 60 * 1000, 'auth:register'), registerUser);
router.post('/login', rateLimit(10, 15 * 60 * 1000, 'auth:login'), loginUser);
router.post('/logout', logoutUser);

// User profile routes (require authentication)
router.get('/profile', requireAuth, getUserProfile);
router.put('/profile', requireAuth, validate(updateUserProfileSchema), updateUserProfile);
router.get('/orders-summary', requireAuth, getUserOrdersSummary);

// Address management routes (require authentication)
router.post('/addresses', requireAuth, validate(createUserAddressSchema), addUserAddress);
router.put('/addresses/:addressId', requireAuth, validate(updateUserAddressSchema), updateUserAddress);
router.delete('/addresses/:addressId', requireAuth, deleteUserAddress);

// Admin routes (require authentication + admin role)
router.get('/admin/all', requireAuth, requireAdmin, getAllUsers);
router.get('/admin/stats', requireAuth, requireAdmin, getUserStats);
router.get('/admin/vendors', requireAuth, requireAdmin, getVendors);
router.put('/admin/vendors/:storeId/approve', requireAuth, requireAdmin, approveVendorStore);
router.put('/admin/vendors/:storeId/reject', requireAuth, requireAdmin, rejectVendorStore);
router.get('/admin/affiliates', requireAuth, requireAdmin, getAffiliates);
router.put('/admin/affiliates/:affiliateProfileId/approve', requireAuth, requireAdmin, approveAffiliateProfile);
router.put('/admin/affiliates/:affiliateProfileId/reject', requireAuth, requireAdmin, rejectAffiliateProfile);
router.get('/admin/:id', requireAuth, requireAdmin, getUserById);
router.put('/admin/:id', requireAuth, requireAdmin, updateUser);
router.delete('/admin/:id', requireAuth, requireAdmin, deleteUser);

export default router;
