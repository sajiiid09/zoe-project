import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  getCatalogProduct,
  listCatalogProducts,
  updateCatalogProduct,
  updateCatalogProductStatus,
} from '../controllers/adminCatalogController.js';
import {
  updateCatalogProductSchema,
  updateCatalogStatusSchema,
} from '../validators/submissionValidators.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', listCatalogProducts);
router.get('/:id', getCatalogProduct);
router.put('/:id', validate(updateCatalogProductSchema), updateCatalogProduct);
router.put('/:id/status', validate(updateCatalogStatusSchema), updateCatalogProductStatus);

export default router;
