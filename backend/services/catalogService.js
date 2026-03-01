import { catalogRepository } from '../repositories/catalogRepository.js';
import { NotFoundError } from '../utils/errors.js';
import { ensureNonNegativeInteger, ensurePositiveAmount } from '../utils/money.js';

const mapCatalogProduct = (product) => ({
  ...product,
  retailPrice: Number(product.retailPrice),
});

export class CatalogService {
  constructor(repository = catalogRepository) {
    this.repository = repository;
  }

  async listAll() {
    const products = await this.repository.listAll();
    return products.map(mapCatalogProduct);
  }

  async getById(id) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundError('Catalog product not found');
    }

    return mapCatalogProduct(product);
  }

  async update(id, payload) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('Catalog product not found');
    }

    const updated = await this.repository.update(id, {
      title: payload.title ?? existing.title,
      description: payload.description ?? existing.description,
      category: payload.category ?? existing.category,
      retailPrice:
        payload.retailPrice !== undefined
          ? ensurePositiveAmount(payload.retailPrice, 'retailPrice')
          : existing.retailPrice,
      stock:
        payload.stock !== undefined
          ? ensureNonNegativeInteger(payload.stock, 'stock')
          : existing.stock,
      isFeatured:
        payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : existing.isFeatured,
    });

    return mapCatalogProduct(updated);
  }

  async updateStatus(id, status) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('Catalog product not found');
    }

    const updated = await this.repository.update(id, { status });
    return mapCatalogProduct(updated);
  }
}

export const catalogService = new CatalogService();
