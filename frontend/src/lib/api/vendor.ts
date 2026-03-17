import { ApiError, apiClient } from "@/lib/api/client";
import { readStoredSession } from "@/lib/api/auth";
import { getVendorFeeStatus } from "@/lib/api/payments";
import { unwrapApiArray, unwrapApiData, type ApiEnvelope } from "@/lib/api/response";
import type {
  AccessStatus,
  VendorProduct,
  VendorStore,
  VendorSubmission,
} from "@/types/operations";

type BackendApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
type BackendSubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "ARCHIVED";

type BackendVendorStore = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  approvalStatus: BackendApprovalStatus;
  rejectionNote?: string | null;
};

type BackendVendorProduct = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number | string;
  stock?: number | null;
  images?: unknown;
  approvalStatus: BackendApprovalStatus;
  rejectionNote?: string | null;
  store?: {
    name?: string | null;
    owner?: {
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    } | null;
  } | null;
};

type BackendVendorSubmission = {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  rejectionReason?: string | null;
  status: BackendSubmissionStatus;
  vendorQuotedPrice?: number | string;
  suggestedRetailPrice?: number | string | null;
  stockAvailable?: number | null;
  currency?: string | null;
  images?: unknown;
  store?: {
    name?: string | null;
  } | null;
  vendor?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
};

type VendorDashboardResponse = ApiEnvelope<{
  hasStore: boolean;
  store?: {
    id: string;
    name: string;
    approvalStatus: BackendApprovalStatus;
  };
  stats?: {
    totalProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    rejectedProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
}>;

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
};

const toDisplayName = (
  user?: { firstName?: string | null; lastName?: string | null; email?: string | null } | null
) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || undefined;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapApprovalStatus = (
  status?: BackendApprovalStatus
): Extract<AccessStatus, "pending" | "approved" | "needs_changes"> => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "needs_changes";
  return "pending";
};

const mapStore = (store: BackendVendorStore): VendorStore => ({
  id: store.id,
  name: store.name,
  slug: store.slug ?? undefined,
  description: store.description ?? "",
  supportEmail: store.email ?? "",
  phone: store.phone ?? "",
  address: store.address ?? "",
  logo: store.logo ?? "",
  banner: store.banner ?? "",
  reviewStatus: mapApprovalStatus(store.approvalStatus),
  rejectionNote: store.rejectionNote ?? undefined,
});

export const isVendorStoreComplete = (store: VendorStore | null) => {
  return Boolean(store?.name.trim() && store?.supportEmail.trim());
};

const mapProductStatus = (
  status?: BackendApprovalStatus
): VendorProduct["status"] => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  return "pending";
};

const mapProduct = (product: BackendVendorProduct): VendorProduct => ({
  id: product.id,
  title: product.name,
  description: product.description ?? "",
  price: toNumber(product.price, 0),
  stock: Math.max(0, Math.floor(toNumber(product.stock, 0))),
  category: product.category ?? "Uncategorized",
  images: toStringArray(product.images),
  status: mapProductStatus(product.approvalStatus),
  rejectionNote: product.rejectionNote ?? undefined,
  storeName: product.store?.name ?? undefined,
  vendorName: toDisplayName(product.store?.owner ?? null),
});

const mapSubmissionStatus = (
  status: BackendSubmissionStatus
): VendorSubmission["status"] => {
  if (status === "ACCEPTED") return "accepted";
  if (status === "REJECTED") return "rejected";
  return "pending";
};

const mapSubmission = (submission: BackendVendorSubmission): VendorSubmission => ({
  id: submission.id,
  title: submission.title,
  category: submission.category ?? "Uncategorized",
  description: submission.description ?? "",
  images: toStringArray(submission.images),
  status: mapSubmissionStatus(submission.status),
  vendorQuotedPrice: toNumber(submission.vendorQuotedPrice, 0),
  suggestedRetailPrice:
    submission.suggestedRetailPrice === null || submission.suggestedRetailPrice === undefined
      ? null
      : toNumber(submission.suggestedRetailPrice, 0),
  stockAvailable: Math.max(0, Math.floor(toNumber(submission.stockAvailable, 0))),
  currency: submission.currency ?? "usd",
  reviewable: submission.status === "SUBMITTED" || submission.status === "UNDER_REVIEW",
  rejectionReason: submission.rejectionReason ?? undefined,
  notes: submission.rejectionReason ?? submission.description ?? "",
  storeName: submission.store?.name ?? undefined,
  vendorName: toDisplayName(submission.vendor ?? null),
});

export const getVendorStatus = async (): Promise<AccessStatus> => {
  const session = readStoredSession();
  if (session?.user.role !== "vendor") return "blocked";

  try {
    const [feePaid, store] = await Promise.all([
      getVendorFeeStatus(),
      getVendorStore(),
    ]);
    const storeComplete = isVendorStoreComplete(store);

    if (!store || !storeComplete) {
      return "setup_required";
    }

    if (!feePaid) {
      return "payment_required";
    }

    return store.reviewStatus ?? "pending";
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      return "blocked";
    }
    return "pending";
  }
};

export const setVendorStatusLocal = (_status: AccessStatus) => {
  // Local status persistence was removed. Status is backend-derived.
  void _status;
};

export const getVendorDashboardStats = async () => {
  const status = await getVendorStatus();
  if (status !== "approved") {
    return {
      products: 0,
      submissions: 0,
      pendingApprovals: status === "pending" ? 1 : 0,
      approvedProducts: 0,
      rejectedProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    };
  }

  const [dashboard, submissions] = await Promise.all([
    apiClient<VendorDashboardResponse>("/vendor/dashboard"),
    listVendorSubmissions(),
  ]);

  const data = unwrapApiData(dashboard, { hasStore: false });
  const stats = data.stats ?? {
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  return {
    products: stats.totalProducts,
    submissions: submissions.length,
    pendingApprovals:
      stats.pendingProducts +
      submissions.filter((submission) => submission.status === "pending").length,
    approvedProducts: stats.approvedProducts,
    rejectedProducts: stats.rejectedProducts,
    totalOrders: stats.totalOrders,
    totalRevenue: toNumber(stats.totalRevenue, 0),
  };
};

export const getVendorStore = async (): Promise<VendorStore | null> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendVendorStore>>("/vendor/store");
    const store = unwrapApiData<BackendVendorStore | null>(response, null);
    return store ? mapStore(store) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveVendorStore = async (
  payload: VendorStore
): Promise<VendorStore> => {
  const method = payload.id ? "PUT" : "POST";
  const response = await apiClient<ApiEnvelope<BackendVendorStore>>("/vendor/store", {
    method,
    body: JSON.stringify({
      name: payload.name,
      description: payload.description || null,
      logo: payload.logo || null,
      banner: payload.banner || null,
      address: payload.address || null,
      phone: payload.phone || null,
      email: payload.supportEmail || null,
    }),
  });

  const store = unwrapApiData<BackendVendorStore | null>(response, null);
  if (!store) {
    throw new Error("Store save returned no payload");
  }

  return mapStore(store);
};

export const listVendorProducts = async (): Promise<VendorProduct[]> => {
  const response = await apiClient<ApiEnvelope<BackendVendorProduct[]>>(
    "/vendor/products?limit=200"
  );
  return unwrapApiArray(response).map(mapProduct);
};

export const saveVendorProduct = async (
  payload: VendorProduct
): Promise<VendorProduct> => {
  const path = payload.id ? `/vendor/products/${payload.id}` : "/vendor/products";
  const method = payload.id ? "PUT" : "POST";

  const response = await apiClient<ApiEnvelope<BackendVendorProduct>>(path, {
    method,
    body: JSON.stringify({
      name: payload.title,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
      description: payload.description || null,
      images: payload.images,
    }),
  });

  const product = unwrapApiData<BackendVendorProduct | null>(response, null);
  if (!product) {
    throw new Error("Product save returned no payload");
  }

  return mapProduct(product);
};

export const deleteVendorProduct = async (id: string): Promise<void> => {
  await apiClient<ApiEnvelope<unknown>>(`/vendor/products/${id}`, {
    method: "DELETE",
  });
};

export const listVendorSubmissions = async (): Promise<VendorSubmission[]> => {
  const response = await apiClient<ApiEnvelope<BackendVendorSubmission[]>>(
    "/vendor/submissions"
  );
  return unwrapApiArray(response).map(mapSubmission);
};

export const saveVendorSubmission = async (
  payload: VendorSubmission
): Promise<VendorSubmission> => {
  const path = payload.id
    ? `/vendor/submissions/${payload.id}`
    : "/vendor/submissions";
  const method = payload.id ? "PUT" : "POST";
  const body =
    method === "POST"
      ? {
          title: payload.title,
          category: payload.category,
          description: payload.description || null,
          vendorQuotedPrice: payload.vendorQuotedPrice,
          suggestedRetailPrice: payload.suggestedRetailPrice,
          stockAvailable: payload.stockAvailable,
          currency: payload.currency || "usd",
          images: payload.images,
        }
      : {
          title: payload.title,
          category: payload.category,
          description: payload.description || null,
          vendorQuotedPrice: payload.vendorQuotedPrice,
          suggestedRetailPrice: payload.suggestedRetailPrice,
          stockAvailable: payload.stockAvailable,
          images: payload.images,
        };

  const response = await apiClient<ApiEnvelope<BackendVendorSubmission>>(path, {
    method,
    body: JSON.stringify(body),
  });

  const submission = unwrapApiData<BackendVendorSubmission | null>(response, null);
  if (!submission) {
    throw new Error("Submission save returned no payload");
  }

  return mapSubmission(submission);
};

export const deleteVendorSubmission = async (id: string): Promise<void> => {
  await apiClient<ApiEnvelope<unknown>>(`/vendor/submissions/${id}`, {
    method: "DELETE",
  });
};
