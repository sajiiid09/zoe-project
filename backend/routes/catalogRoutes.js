import express from 'express';
import { getPublicCatalog, getPublicCatalogProduct } from '../controllers/catalogController.js';

const router = express.Router();

router.get('/', getPublicCatalog);
router.get('/:id', getPublicCatalogProduct);

export default router;
