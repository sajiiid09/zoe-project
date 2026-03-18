import type { ProductCardModel, ProductViewModel } from "@/types/catalog";

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

type BackendCatalogProduct = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  retailPrice: number | string;
  stock?: number | null;
  images?: unknown;
  status?: string;
};

const APPROVED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "a.nooncdn.com",
  "cdn.britannica.com",
]);

const isApprovedImageUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && APPROVED_IMAGE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCategory = (category?: string | null) => {
  if (!category) return "Uncategorized";
  return category;
};

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.reduce<string[]>((acc, item) => {
    if (typeof item !== "string") {
      return acc;
    }

    const normalized = item.trim();
    if (!normalized || !isApprovedImageUrl(normalized)) {
      return acc;
    }

    acc.push(normalized);
    return acc;
  }, []);
};

const stockStatusFromCount = (stock: number): ProductCardModel["stockStatus"] => {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
};

const deliveryLabelByStock = (stockStatus: ProductCardModel["stockStatus"]) => {
  if (stockStatus === "in_stock") return "Delivery by tomorrow";
  if (stockStatus === "low_stock") return "Limited stock, ships in 1-2 days";
  return "Currently unavailable";
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const toProductSlug = (name: string, id: string) => {
  const base = slugify(name) || "product";
  return `${base}--${id}`;
};

export const parseProductIdFromSlug = (slug: string) => {
  const parts = slug.split("--");
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

export const mapBackendProductToCard = (product: BackendProduct): ProductCardModel => {
  const stock = toNumber(product.stock, 0);
  const stockStatus = stockStatusFromCount(stock);
  const price = toNumber(product.price, 0);
  const images = normalizeImages(product.images);

  return {
    id: product.id,
    slug: toProductSlug(product.name, product.id),
    title: product.name,
    image: images[0] ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80",
    category: normalizeCategory(product.category),
    rating: toNumber(product.ratingAverage, 0),
    reviewCount: Math.max(0, Math.floor(toNumber(product.ratingCount, 0))),
    price: { amount: price, currency: "USD" },
    compareAtPrice: undefined,
    badge: stockStatus === "low_stock" ? "Limited stock" : undefined,
    stockStatus,
    deliveryLabel: deliveryLabelByStock(stockStatus),
    source: "legacy",
  };
};

export const mapBackendProductToView = (product: BackendProduct): ProductViewModel => {
  const base = mapBackendProductToCard(product);

  return {
    ...base,
    description: product.description ?? undefined,
    features: [],
    vendorName: undefined,
  };
};

export const mapBackendCatalogProductToCard = (
  product: BackendCatalogProduct
): ProductCardModel => {
  const stock = toNumber(product.stock, 0);
  const stockStatus = stockStatusFromCount(stock);
  const images = normalizeImages(product.images);

  return {
    id: product.id,
    slug: toProductSlug(product.title, product.id),
    title: product.title,
    image: images[0] ?? "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&auto=format&fit=crop&q=80",
    category: normalizeCategory(product.category),
    rating: 0,
    reviewCount: 0,
    price: { amount: toNumber(product.retailPrice, 0), currency: "USD" },
    compareAtPrice: undefined,
    badge: product.status === "ACTIVE" ? "In catalog" : undefined,
    stockStatus,
    deliveryLabel: deliveryLabelByStock(stockStatus),
    source: "catalog",
  };
};

export const mapBackendCatalogProductToView = (
  product: BackendCatalogProduct
): ProductViewModel => {
  const base = mapBackendCatalogProductToCard(product);

  return {
    ...base,
    description: product.description ?? undefined,
    features: [],
    vendorName: undefined,
  };
};
