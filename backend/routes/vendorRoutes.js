import express from 'express';
import { requireAuth, requireVendor } from '../middleware/authMiddleware.js';
import {
  createStore,
  getMyStore,
  updateMyStore,
  signVendorMediaUpload,
  getMyProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorDashboard,
} from '../controllers/vendorController.js';

const router = express.Router();

// All vendor routes require authentication + VENDOR role
router.use(requireAuth, requireVendor);

// Dashboard
router.get('/dashboard', getVendorDashboard);

// Store
router.post('/store', createStore);
router.get('/store', getMyStore);
router.put('/store', updateMyStore);
router.post('/media/sign', signVendorMediaUpload);

// Products
router.get('/products', getMyProducts);
router.post('/products', createVendorProduct);
router.put('/products/:id', updateVendorProduct);
router.delete('/products/:id', deleteVendorProduct);

export default router;
