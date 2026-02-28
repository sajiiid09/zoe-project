import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getProductCategories,
  getFeaturedProducts,
  getRelatedProducts,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (optional authentication)
router.get('/', optionalAuth, getProducts);
router.get('/categories', getProductCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/related', getRelatedProducts);

// Protected routes (require authentication)
router.post('/:id/reviews', requireAuth, addProductReview);
router.put('/:id/reviews/:reviewId', requireAuth, updateProductReview);
router.delete('/:id/reviews/:reviewId', requireAuth, deleteProductReview);

// Admin routes (require authentication + admin role)
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
