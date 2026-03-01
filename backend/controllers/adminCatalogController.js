import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/authMiddleware.js';
import { catalogService } from '../services/catalogService.js';

export const listCatalogProducts = asyncHandler(async (req, res) => {
  const products = await catalogService.listAll();
  return sendSuccess(res, products);
});

export const getCatalogProduct = asyncHandler(async (req, res) => {
  const product = await catalogService.getById(req.params.id);
  return sendSuccess(res, product);
});

export const updateCatalogProduct = asyncHandler(async (req, res) => {
  const product = await catalogService.update(req.params.id, req.body);
  return sendSuccess(res, product, 'Catalog product updated successfully');
});

export const updateCatalogProductStatus = asyncHandler(async (req, res) => {
  const product = await catalogService.updateStatus(req.params.id, req.body.status);
  return sendSuccess(res, product, 'Catalog product status updated successfully');
});
