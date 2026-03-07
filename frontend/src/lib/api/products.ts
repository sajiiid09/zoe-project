import { shapeLegacyProduct } from "@/lib/api/adapters";
import type { PaginatedResponse } from "@/lib/api/pagination";
import { emptyPage } from "@/lib/api/pagination";
import type { LegacyProduct, ProductCardModel } from "@/types/catalog";

const demoLegacyProducts: LegacyProduct[] = [
  {
    id: "1",
    slug: "wireless-noise-cancelling-headphones",
    title: "Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "Electronics",
    rating: 4.6,
    reviewCount: 1182,
    legacyPrice: { amount: 249, currency: "USD" },
    legacySalePrice: { amount: 199, currency: "USD" },
    stockStatus: "in_stock",
  },
  {
    id: "2",
    slug: "family-pack-detergent",
    title: "Family Pack Laundry Detergent (4L)",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800",
    category: "Groceries",
    rating: 4.3,
    reviewCount: 334,
    legacyPrice: { amount: 19, currency: "USD" },
    stockStatus: "low_stock",
  },
];

export const listLegacyProducts = async (): Promise<PaginatedResponse<ProductCardModel>> => {
  return {
    ...emptyPage<ProductCardModel>(1, 20),
    items: demoLegacyProducts.map(shapeLegacyProduct),
    total: demoLegacyProducts.length,
  };
};
