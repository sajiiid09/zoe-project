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
  description?: string | null;
  email?: string | null;
  approvalStatus: BackendApprovalStatus;
};

type BackendVendorProduct = {
  id: string;
  name: string;
  category?: string | null;
  price: number | string;
  stock?: number | null;
  approvalStatus: BackendApprovalStatus;
};

type BackendVendorSubmission = {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  rejectionReason?: string | null;
  status: BackendSubmissionStatus;
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

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapApprovalStatus = (status?: BackendApprovalStatus): AccessStatus => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "blocked";
  return "pending";
};

const mapStore = (store: BackendVendorStore): VendorStore => ({
  id: store.id,
  name: store.name,
  description: store.description ?? "",
  supportEmail: store.email ?? "",
});

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
  price: toNumber(product.price, 0),
  stock: Math.max(0, Math.floor(toNumber(product.stock, 0))),
  category: product.category ?? "Uncategorized",
  status: mapProductStatus(product.approvalStatus),
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
  notes: submission.rejectionReason ?? submission.description ?? "",
  status: mapSubmissionStatus(submission.status),
});

export const getVendorStatus = async (): Promise<AccessStatus> => {
  const session = readStoredSession();
  if (session?.user.role !== "vendor") return "blocked";

  try {
    const feePaid = await getVendorFeeStatus();
    if (!feePaid) {
      return "payment_required";
    }

    const dashboard = await apiClient<VendorDashboardResponse>("/vendor/dashboard");
    const data = unwrapApiData(dashboard, { hasStore: false });
    if (!data.hasStore) return "pending";
    return mapApprovalStatus(data.store?.approvalStatus);
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
  const [dashboard, submissions] = await Promise.all([
    apiClient<VendorDashboardResponse>("/vendor/dashboard"),
    listVendorSubmissions(),
  ]);

  const data = unwrapApiData(dashboard, { hasStore: false });
  const stats = data.stats ?? {
    totalProducts: 0,
    pendingProducts: 0,
  };

  return {
    products: stats.totalProducts,
    submissions: submissions.length,
    pendingApprovals:
      stats.pendingProducts +
      submissions.filter((submission) => submission.status === "pending").length,
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
      description: null,
      images: [],
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
          description: payload.notes || null,
          vendorQuotedPrice: 10,
          suggestedRetailPrice: 15,
          stockAvailable: 5,
          currency: "usd",
          images: [],
        }
      : {
          title: payload.title,
          category: payload.category,
          description: payload.notes || null,
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
