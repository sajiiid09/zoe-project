import { shapeCatalogProduct } from "@/lib/api/adapters";
import { apiClient } from "@/lib/api/client";
import type { CatalogProduct, ProductViewModel } from "@/types/catalog";

const demoCatalogProducts: CatalogProduct[] = [
  { catalogId: "c1", slug: "premium-ergonomic-chair", title: "Premium Ergonomic Office Chair", heroImage: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800", categoryPath: ["Furniture", "Office"], rating: 4.8, reviewCount: 120, listPrice: { amount: 399, currency: "USD" }, fulfillment: "vendor" },
  { catalogId: "c2", slug: "wooden-coffee-table", title: "Minimalist Wooden Coffee Table", heroImage: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800", categoryPath: ["Furniture", "Living Room"], rating: 4.5, reviewCount: 85, listPrice: { amount: 150, currency: "USD" }, fulfillment: "platform" },
  { catalogId: "c3", slug: "smart-home-hub", title: "Smart Home Hub Gen 2", heroImage: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800", categoryPath: ["Electronics", "Smart Home"], rating: 4.2, reviewCount: 310, listPrice: { amount: 129, currency: "USD" }, fulfillment: "vendor" },
];

export const getCatalogEntity = async (id: string): Promise<ProductViewModel | null> => {
  try {
     const response = await apiClient<CatalogProduct>(`/catalog/${id}`);
     return { ...shapeCatalogProduct(response), description: "Detailed catalog description placeholder.", features: ["Feature 1", "Feature 2"] };
  } catch {
     const item = demoCatalogProducts.find(p => p.catalogId === id);
     return item ? { ...shapeCatalogProduct(item), description: "Detailed catalog description placeholder.", features: ["Feature 1", "Feature 2"] } : null;
  }
};
