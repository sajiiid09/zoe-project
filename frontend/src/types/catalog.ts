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
};
