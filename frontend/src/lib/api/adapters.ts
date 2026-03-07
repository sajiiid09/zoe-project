import type { CatalogProduct, LegacyProduct, ProductCardModel } from "@/types/catalog";

export const shapeLegacyProduct = (item: LegacyProduct): ProductCardModel => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  image: item.image,
  category: item.category,
  rating: item.rating,
  reviewCount: item.reviewCount,
  price: item.legacySalePrice ?? item.legacyPrice,
  compareAtPrice: item.legacySalePrice ? item.legacyPrice : undefined,
  badge: item.stockStatus === "low_stock" ? "Limited stock" : undefined,
  stockStatus: item.stockStatus,
  deliveryLabel: item.stockStatus === "in_stock" ? "Delivery by tomorrow" : "Delivery in 2-4 days",
});

export const shapeCatalogProduct = (item: CatalogProduct): ProductCardModel => ({
  id: item.catalogId,
  slug: item.slug,
  title: item.title,
  image: item.heroImage,
  category: item.categoryPath.join(" > "),
  rating: item.rating,
  reviewCount: item.reviewCount,
  price: item.dealPrice ?? item.listPrice,
  compareAtPrice: item.dealPrice ? item.listPrice : undefined,
  badge: item.fulfillment === "platform" ? "Fulfilled by Zoe" : "Vendor shipped",
  stockStatus: "in_stock",
  deliveryLabel: item.fulfillment === "platform" ? "Delivery by tomorrow" : "Delivery in 2-4 days",
});
