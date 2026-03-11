import { mapBackendProductToCard, parseProductIdFromSlug } from "@/lib/api/adapters";
import { ApiError, apiClient } from "@/lib/api/client";
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

export type ProductApiError = {
  code: "API_UNAVAILABLE";
  message: string;
  status?: number;
};

export type ProductListResult = PaginatedResponse<ProductCardModel> & {
  error?: ProductApiError;
};

export type ProductLookupResult = {
  product: ProductCardModel | null;
  error?: ProductApiError;
};

export type HomepageRailsResult = {
  rails: Array<{
    title: string;
    subtitle: string;
    href: string;
    items: ProductCardModel[];
  }>;
  error?: ProductApiError;
};

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

const toProductApiError = (error: unknown): ProductApiError => {
  if (error instanceof ApiError) {
    const details =
      error.details && typeof error.details === "object"
        ? (error.details as Record<string, unknown>)
        : null;
    const backendMessage =
      details && typeof details.message === "string" ? details.message : null;
    return {
      code: "API_UNAVAILABLE",
      status: error.status,
      message:
        backendMessage ||
        "Could not load products from backend. Check API availability and NEXT_PUBLIC_API_BASE_URL.",
    };
  }

  return {
    code: "API_UNAVAILABLE",
    message:
      "Could not load products from backend. Check API availability and NEXT_PUBLIC_API_BASE_URL.",
  };
};

export const listLegacyProducts = async (
  query: ProductQuery = {}
): Promise<ProductListResult> => {
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
  } catch (error) {
    return {
      ...emptyPage(page, pageSize),
      error: toProductApiError(error),
    };
  }
};

export const getLegacyProductBySlug = async (
  slug: string
): Promise<ProductLookupResult> => {
  const productId = parseProductIdFromSlug(slug);

  if (productId) {
    try {
      const response = await apiClient<BackendProductResponse>(`/products/${productId}`);
      const product = unwrapApiData<BackendProduct | null>(response, null);
      return { product: product ? mapBackendProductToCard(product) : null };
    } catch (error) {
      return {
        product: null,
        error: toProductApiError(error),
      };
    }
  }

  const productList = await listLegacyProducts({
    q: slug.replace(/-/g, " "),
    pageSize: 50,
  });

  return {
    product: productList.items.find((item) => item.slug === slug) ?? null,
    error: productList.error,
  };
};

export const getHomepageRails = async (): Promise<HomepageRailsResult> => {
  const [deals, trending, newArrivals] = await Promise.all([
    listLegacyProducts({ sort: "deals", pageSize: 8 }),
    listLegacyProducts({ sort: "rating", pageSize: 8 }),
    listLegacyProducts({ sort: "new", pageSize: 8 }),
  ]);

  return {
    rails: [
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
    ],
    error: deals.error || trending.error || newArrivals.error,
  };
};
