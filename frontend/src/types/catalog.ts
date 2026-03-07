export type Money = {
  amount: number;
  currency: string;
};

export type LegacyProduct = {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  legacyPrice: Money;
  legacySalePrice?: Money;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

export type CatalogProduct = {
  catalogId: string;
  slug: string;
  title: string;
  heroImage: string;
  categoryPath: string[];
  rating: number;
  reviewCount: number;
  listPrice: Money;
  dealPrice?: Money;
  fulfillment: "platform" | "vendor";
};

export type ProductCardModel = {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: Money;
  compareAtPrice?: Money;
  badge?: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  deliveryLabel?: string;
  source: "legacy" | "catalog";
};

export type ProductViewModel = ProductCardModel & {
  description?: string;
  features?: string[];
  vendorName?: string;
};

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: "relevance" | "deals" | "rating" | "price_asc" | "price_desc" | "new";
  minRating?: number;
  page?: number;
  pageSize?: number;
};
