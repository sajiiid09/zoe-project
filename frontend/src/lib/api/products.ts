import { shapeLegacyProduct } from "@/lib/api/adapters";
import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/pagination";
import type { LegacyProduct, ProductCardModel, ProductQuery } from "@/types/catalog";

type LegacyListResponse = {
  results?: LegacyProduct[];
  items?: LegacyProduct[];
  count?: number;
};

const demoLegacyProducts: LegacyProduct[] = [
  { id: "1", slug: "wireless-noise-cancelling-headphones", title: "Wireless Noise Cancelling Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", category: "Electronics", rating: 4.6, reviewCount: 1182, legacyPrice: { amount: 249, currency: "USD" }, legacySalePrice: { amount: 199, currency: "USD" }, stockStatus: "in_stock" },
  { id: "2", slug: "family-pack-detergent", title: "Family Pack Laundry Detergent (4L)", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800", category: "Groceries", rating: 4.3, reviewCount: 334, legacyPrice: { amount: 19, currency: "USD" }, stockStatus: "low_stock" },
  { id: "3", slug: "smart-4k-tv-55inch", title: "Smart 4K TV 55-inch HDR", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800", category: "Electronics", rating: 4.7, reviewCount: 932, legacyPrice: { amount: 799, currency: "USD" }, legacySalePrice: { amount: 649, currency: "USD" }, stockStatus: "in_stock" },
  { id: "4", slug: "mens-running-shoes", title: "Men's Lightweight Running Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", category: "Fashion", rating: 4.2, reviewCount: 525, legacyPrice: { amount: 89, currency: "USD" }, legacySalePrice: { amount: 59, currency: "USD" }, stockStatus: "in_stock" },
  { id: "5", slug: "air-fryer-xl", title: "XL Digital Air Fryer", image: "https://images.unsplash.com/photo-1585515656093-8c4a9d5f16d7?w=800", category: "Home", rating: 4.4, reviewCount: 402, legacyPrice: { amount: 179, currency: "USD" }, legacySalePrice: { amount: 139, currency: "USD" }, stockStatus: "in_stock" },
  { id: "6", slug: "baby-diaper-pack", title: "Baby Diaper Jumbo Pack", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800", category: "Baby", rating: 4.8, reviewCount: 2210, legacyPrice: { amount: 38, currency: "USD" }, legacySalePrice: { amount: 29, currency: "USD" }, stockStatus: "in_stock" },
  { id: "7", slug: "serum-vitamin-c", title: "Vitamin C Brightening Face Serum", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800", category: "Beauty", rating: 4.1, reviewCount: 276, legacyPrice: { amount: 24, currency: "USD" }, stockStatus: "in_stock" },
  { id: "8", slug: "car-vacuum-portable", title: "Portable Car Vacuum Cleaner", image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800", category: "Automotive", rating: 4.0, reviewCount: 189, legacyPrice: { amount: 49, currency: "USD" }, legacySalePrice: { amount: 35, currency: "USD" }, stockStatus: "low_stock" },
  { id: "9", slug: "gaming-mechanical-keyboard", title: "RGB Mechanical Gaming Keyboard", image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800", category: "Electronics", rating: 4.5, reviewCount: 678, legacyPrice: { amount: 129, currency: "USD" }, legacySalePrice: { amount: 99, currency: "USD" }, stockStatus: "in_stock" },
  { id: "10", slug: "kitchen-knife-set", title: "Stainless Steel Kitchen Knife Set", image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800", category: "Home", rating: 4.2, reviewCount: 245, legacyPrice: { amount: 72, currency: "USD" }, stockStatus: "in_stock" },
  { id: "11", slug: "women-cotton-kurti", title: "Women Printed Cotton Kurti", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800", category: "Fashion", rating: 4.4, reviewCount: 391, legacyPrice: { amount: 42, currency: "USD" }, legacySalePrice: { amount: 31, currency: "USD" }, stockStatus: "in_stock" },
  { id: "12", slug: "protein-powder-whey", title: "Whey Protein Powder 2kg", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800", category: "Sports", rating: 4.6, reviewCount: 554, legacyPrice: { amount: 89, currency: "USD" }, legacySalePrice: { amount: 74, currency: "USD" }, stockStatus: "out_of_stock" },
];

const normalizeSort = (sort: ProductQuery["sort"]) => sort ?? "relevance";

const sortItems = (items: ProductCardModel[], sort: ProductQuery["sort"]) => {
  switch (normalizeSort(sort)) {
    case "deals":
      return [...items].sort((a, b) => ((b.compareAtPrice?.amount ?? b.price.amount) - b.price.amount) - ((a.compareAtPrice?.amount ?? a.price.amount) - a.price.amount));
    case "rating":
      return [...items].sort((a, b) => b.rating - a.rating);
    case "price_asc":
      return [...items].sort((a, b) => a.price.amount - b.price.amount);
    case "price_desc":
      return [...items].sort((a, b) => b.price.amount - a.price.amount);
    case "new":
      return [...items].reverse();
    default:
      return items;
  }
};

const queryLocalProducts = (query: ProductQuery = {}): PaginatedResponse<ProductCardModel> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;

  const filtered = demoLegacyProducts
    .map(shapeLegacyProduct)
    .filter((item) => {
      const q = query.q?.trim().toLowerCase();
      const inQuery = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const inCategory = !query.category || item.category.toLowerCase() === query.category.toLowerCase();
      const inRating = !query.minRating || item.rating >= query.minRating;
      return inQuery && inCategory && inRating;
    });

  const sorted = sortItems(filtered, query.sort);
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    page,
    pageSize,
    total: sorted.length,
  };
};

export const listLegacyProducts = async (query: ProductQuery = {}): Promise<PaginatedResponse<ProductCardModel>> => {
  const params = new URLSearchParams();
  if (query.q) params.set("search", query.q);
  if (query.category) params.set("category", query.category);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("page_size", String(query.pageSize));

  const queryString = params.toString();

  try {
    const response = await apiClient<LegacyListResponse>(`/products/${queryString ? `?${queryString}` : ""}`);
    const rawItems = response.results ?? response.items ?? [];
    const shaped = rawItems.map(shapeLegacyProduct);
    const sorted = sortItems(shaped, query.sort);
    return {
      items: sorted,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? (sorted.length || 12),
      total: response.count ?? sorted.length,
    };
  } catch {
    return queryLocalProducts(query);
  }
};

export const getHomepageRails = async () => {
  const [deals, trending, newArrivals] = await Promise.all([
    listLegacyProducts({ sort: "deals", pageSize: 8 }),
    listLegacyProducts({ sort: "rating", pageSize: 8 }),
    listLegacyProducts({ sort: "new", pageSize: 8 }),
  ]);

  return [
    { title: "Top Deals", subtitle: "Price drops across essential categories", href: "/search?sort=deals", items: deals.items },
    { title: "Trending Now", subtitle: "Most popular choices today", href: "/search?sort=rating", items: trending.items },
    { title: "New Arrivals", subtitle: "Fresh inventory added recently", href: "/search?sort=new", items: newArrivals.items },
  ];
};
