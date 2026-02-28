import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  addShippingInfo,
  markOrderDelivered,
  cancelOrder,
  getAllOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (must come before /:id routes to avoid conflicts)
router.get('/admin/all', requireAuth, requireAdmin, getAllOrders);
router.get('/admin/stats', requireAuth, requireAdmin, getOrderStats);

// User routes (require authentication)
router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, getUserOrders);
router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus);
router.put('/:id/shipping', requireAuth, requireAdmin, addShippingInfo);
router.put('/:id/delivered', requireAuth, requireAdmin, markOrderDelivered);
router.put('/:id/cancel', requireAuth, cancelOrder);
router.get('/:id', requireAuth, getOrder);

export default router;
