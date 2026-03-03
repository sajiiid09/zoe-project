import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/authMiddleware.js';
import { catalogService } from '../services/catalogService.js';

/**
 * GET /api/catalog
 * Publicly list all active catalog products
 */
export const getPublicCatalog = asyncHandler(async (req, res) => {
  const products = await catalogService.listAll();
  
  // Only show ACTIVE products to the public
  const activeProducts = products.filter(p => p.status === 'ACTIVE');
  
  return sendSuccess(res, activeProducts);
});

/**
 * GET /api/catalog/:id
 * Publicly get a single catalog product
 */
export const getPublicCatalogProduct = asyncHandler(async (req, res) => {
  const product = await catalogService.getById(req.params.id);
  
  if (product.status !== 'ACTIVE') {
      return res.status(404).json({
          success: false,
          message: 'Product not available'
      });
  }
  
  return sendSuccess(res, product);
});
