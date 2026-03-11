import { mapBackendProductToCard, parseProductIdFromSlug } from "@/lib/api/adapters";
import { apiClient } from "@/lib/api/client";
import { emptyPage, type PaginatedResponse } from "@/lib/api/pagination";
import { unwrapApiData, type ApiEnvelope } from "@/lib/api/response";
import type { ProductCardModel, ProductQuery } from "@/types/catalog";

type BackendProduct = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number | string;
  stock?: number | null;
  images?: unknown;
  ratingAverage?: number | null;
  ratingCount?: number | null;
};

type BackendProductListResponse = ApiEnvelope<BackendProduct[]> & {
  pagination?: {
    currentPage?: number;
    totalProducts?: number;
  };
};

type BackendProductResponse = ApiEnvelope<BackendProduct>;

const normalizeSort = (sort: ProductQuery["sort"]) => sort ?? "relevance";

const sortItems = (items: ProductCardModel[], sort: ProductQuery["sort"]) => {
  switch (normalizeSort(sort)) {
    case "deals":
      return [...items].sort(
        (a, b) =>
          (b.compareAtPrice?.amount ?? b.price.amount) - b.price.amount -
          ((a.compareAtPrice?.amount ?? a.price.amount) - a.price.amount)
      );
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

const toBackendOrder = (sort: ProductQuery["sort"]) => {
  if (sort === "price_asc") return { sort: "price", order: "asc" as const };
  if (sort === "price_desc") return { sort: "price", order: "desc" as const };
  if (sort === "rating") return { sort: "rating.average", order: "desc" as const };
  return { sort: "createdAt", order: "desc" as const };
};

export const listLegacyProducts = async (
  query: ProductQuery = {}
): Promise<PaginatedResponse<ProductCardModel>> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const params = new URLSearchParams();

  if (query.q) params.set("search", query.q);
  if (query.category) params.set("category", query.category);
  if (query.minRating) params.set("minRating", String(query.minRating));
  params.set("page", String(page));
  params.set("limit", String(pageSize));

  const backendSort = toBackendOrder(query.sort);
  params.set("sort", backendSort.sort);
  params.set("order", backendSort.order);

  try {
    const response = await apiClient<BackendProductListResponse>(
      `/products?${params.toString()}`
    );
    const backendItems = unwrapApiData<BackendProduct[]>(response, []);
    const mappedItems = backendItems.map(mapBackendProductToCard);
    const sortedItems = sortItems(mappedItems, query.sort);

    return {
      items: sortedItems,
      page: response.pagination?.currentPage ?? page,
      pageSize,
      total: response.pagination?.totalProducts ?? sortedItems.length,
    };
  } catch {
    return emptyPage(page, pageSize);
  }
};

export const getLegacyProductBySlug = async (
  slug: string
): Promise<ProductCardModel | null> => {
  const productId = parseProductIdFromSlug(slug);

  if (productId) {
    try {
      const response = await apiClient<BackendProductResponse>(`/products/${productId}`);
      const product = unwrapApiData<BackendProduct | null>(response, null);
      return product ? mapBackendProductToCard(product) : null;
    } catch {
      return null;
    }
  }

  const fallbackList = await listLegacyProducts({
    q: slug.replace(/-/g, " "),
    pageSize: 50,
  });

  return fallbackList.items.find((item) => item.slug === slug) ?? null;
};

export const getHomepageRails = async () => {
  const [deals, trending, newArrivals] = await Promise.all([
    listLegacyProducts({ sort: "deals", pageSize: 8 }),
    listLegacyProducts({ sort: "rating", pageSize: 8 }),
    listLegacyProducts({ sort: "new", pageSize: 8 }),
  ]);

  return [
    {
      title: "Top Deals",
      subtitle: "Price drops across essential categories",
      href: "/search?sort=deals",
      items: deals.items,
    },
    {
      title: "Trending Now",
      subtitle: "Most popular choices today",
      href: "/search?sort=rating",
      items: trending.items,
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh inventory added recently",
      href: "/search?sort=new",
      items: newArrivals.items,
    },
  ];
};
