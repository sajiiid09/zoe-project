import { apiClient } from "@/lib/api/client";
import { listAllOrders } from "@/lib/api/orders";
import { unwrapApiArray, type ApiEnvelope } from "@/lib/api/response";
import type { AdminUserRow, CatalogItem, VendorProduct, VendorSubmission } from "@/types/operations";

type BackendUserRole = "ADMIN" | "CUSTOMER" | "VENDOR" | "AFFILIATE";
type BackendApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type BackendUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: BackendUserRole;
  isActive: boolean;
  vendorFeePaid?: boolean;
  affiliateFeePaid?: boolean;
  store?: {
    id: string;
    approvalStatus: BackendApprovalStatus;
  } | null;
};

type BackendVendor = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  store?: {
    id: string;
    approvalStatus: BackendApprovalStatus;
  } | null;
};

type BackendAffiliateProfile = {
  id: string;
  approvalStatus: BackendApprovalStatus;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    affiliateFeePaid?: boolean;
    isActive?: boolean;
  };
};

type BackendProduct = {
  id: string;
  name: string;
  category?: string | null;
  price: number | string;
  stock?: number | null;
  approvalStatus: BackendApprovalStatus;
};

type BackendSubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "ARCHIVED";

type BackendSubmission = {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  rejectionReason?: string | null;
  status: BackendSubmissionStatus;
};

type BackendCatalogStatus = "DRAFT" | "ACTIVE" | "DISCONTINUED";
type BackendCatalogProduct = {
  id: string;
  title: string;
  category?: string | null;
  status: BackendCatalogStatus;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toFullName = (firstName?: string | null, lastName?: string | null, fallback = "Unknown User") => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || fallback;
};

const mapRole = (role: BackendUserRole): AdminUserRow["role"] => {
  if (role === "ADMIN") return "admin";
  if (role === "VENDOR") return "vendor";
  if (role === "AFFILIATE") return "affiliate";
  return "customer";
};

const mapApprovalStatusToAccess = (status?: BackendApprovalStatus | null): AdminUserRow["status"] => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "blocked";
  return "pending";
};

const mapVendorProductStatus = (
  approvalStatus?: BackendApprovalStatus
): VendorProduct["status"] => {
  if (approvalStatus === "APPROVED") return "approved";
  if (approvalStatus === "REJECTED") return "rejected";
  return "pending";
};

const mapSubmissionStatus = (
  status: BackendSubmissionStatus
): VendorSubmission["status"] => {
  if (status === "ACCEPTED") return "accepted";
  if (status === "REJECTED") return "rejected";
  return "pending";
};

const mapCatalogStatus = (status: BackendCatalogStatus): CatalogItem["status"] => {
  if (status === "ACTIVE") return "active";
  if (status === "DISCONTINUED") return "archived";
  return "draft";
};

const toBackendCatalogStatus = (
  status: CatalogItem["status"]
): BackendCatalogStatus => {
  if (status === "active") return "ACTIVE";
  if (status === "archived") return "DISCONTINUED";
  return "DRAFT";
};

const mapUserStatus = (
  user: BackendUser,
  vendorByUserId: Map<string, BackendVendor>,
  affiliateByUserId: Map<string, BackendAffiliateProfile>
): AdminUserRow["status"] => {
  if (!user.isActive) {
    return "blocked";
  }

  if (user.role === "VENDOR") {
    if (!user.vendorFeePaid) return "payment_required";
    const vendor = vendorByUserId.get(user.id);
    return mapApprovalStatusToAccess(vendor?.store?.approvalStatus ?? user.store?.approvalStatus);
  }

  if (user.role === "AFFILIATE") {
    if (!user.affiliateFeePaid) return "payment_required";
    const affiliate = affiliateByUserId.get(user.id);
    return mapApprovalStatusToAccess(affiliate?.approvalStatus);
  }

  return "approved";
};

let latestUserRows: AdminUserRow[] = [];

export const getAdminDashboardStats = async () => {
  const [users, submissions, orders] = await Promise.all([
    listAdminUsers(),
    listAdminSubmissions(),
    listAllOrders(),
  ]);

  return {
    users: users.length,
    pendingApprovals: users.filter(
      (user) =>
        (user.role === "vendor" || user.role === "affiliate") &&
        user.status !== "approved"
    ).length,
    pendingSubmissions: submissions.filter(
      (submission) => submission.status === "pending"
    ).length,
    orders: orders.length,
  };
};

export const listAdminUsers = async (): Promise<AdminUserRow[]> => {
  const [usersResponse, vendorsResponse, affiliatesResponse] = await Promise.all([
    apiClient<ApiEnvelope<BackendUser[]>>("/users/admin/all?limit=500"),
    apiClient<ApiEnvelope<BackendVendor[]>>("/users/admin/vendors?limit=500"),
    apiClient<ApiEnvelope<BackendAffiliateProfile[]>>("/users/admin/affiliates"),
  ]);

  const users = unwrapApiArray(usersResponse);
  const vendors = unwrapApiArray(vendorsResponse);
  const affiliates = unwrapApiArray(affiliatesResponse);

  const vendorByUserId = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const affiliateByUserId = new Map(
    affiliates
      .filter((profile): profile is BackendAffiliateProfile & { user: NonNullable<BackendAffiliateProfile["user"]> } => Boolean(profile.user))
      .map((profile) => [profile.user.id, profile])
  );

  const rows = users.map((user) => {
    const role = mapRole(user.role);
    const row: AdminUserRow = {
      id: user.id,
      name: toFullName(user.firstName, user.lastName, user.email),
      email: user.email,
      role,
      status: mapUserStatus(user, vendorByUserId, affiliateByUserId),
      vendorStoreId: vendorByUserId.get(user.id)?.store?.id,
      affiliateProfileId: affiliateByUserId.get(user.id)?.id,
    };

    return row;
  });

  latestUserRows = rows;
  return rows;
};

export const setAdminUserStatus = async (
  id: string,
  status: AdminUserRow["status"]
) => {
  let row = latestUserRows.find((item) => item.id === id);

  if (!row) {
    const rows = await listAdminUsers();
    row = rows.find((item) => item.id === id);
  }

  if (!row) return;

  if (row.role === "vendor" && row.vendorStoreId) {
    const path =
      status === "approved"
        ? `/users/admin/vendors/${row.vendorStoreId}/approve`
        : `/users/admin/vendors/${row.vendorStoreId}/reject`;
    const body = status === "approved" ? {} : { reason: "Rejected by admin" };

    await apiClient<ApiEnvelope<unknown>>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return;
  }

  if (row.role === "affiliate" && row.affiliateProfileId) {
    const path =
      status === "approved"
        ? `/users/admin/affiliates/${row.affiliateProfileId}/approve`
        : `/users/admin/affiliates/${row.affiliateProfileId}/reject`;
    const body = status === "approved" ? {} : { reason: "Rejected by admin" };

    await apiClient<ApiEnvelope<unknown>>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return;
  }

  await apiClient<ApiEnvelope<unknown>>(`/users/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive: status !== "blocked" }),
  });
};

export const listAdminProducts = async (): Promise<VendorProduct[]> => {
  const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
    apiClient<ApiEnvelope<BackendProduct[]>>("/products/admin/pending?status=PENDING&limit=200"),
    apiClient<ApiEnvelope<BackendProduct[]>>("/products/admin/pending?status=APPROVED&limit=200"),
    apiClient<ApiEnvelope<BackendProduct[]>>("/products/admin/pending?status=REJECTED&limit=200"),
  ]);

  const allProducts = [
    ...unwrapApiArray(pendingResponse),
    ...unwrapApiArray(approvedResponse),
    ...unwrapApiArray(rejectedResponse),
  ];

  const dedupedById = new Map(allProducts.map((product) => [product.id, product]));

  return [...dedupedById.values()].map((product) => ({
    id: product.id,
    title: product.name,
    category: product.category ?? "Uncategorized",
    price: toNumber(product.price, 0),
    stock: Math.max(0, Math.floor(toNumber(product.stock, 0))),
    status: mapVendorProductStatus(product.approvalStatus),
  }));
};

export const setAdminProductStatus = async (
  id: string,
  status: VendorProduct["status"]
) => {
  if (status === "approved") {
    await apiClient<ApiEnvelope<unknown>>(`/products/admin/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
    return;
  }

  await apiClient<ApiEnvelope<unknown>>(`/products/admin/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason: "Rejected by admin" }),
  });
};

export const listAdminSubmissions = async (): Promise<VendorSubmission[]> => {
  const response = await apiClient<ApiEnvelope<BackendSubmission[]>>("/admin/submissions");
  const submissions = unwrapApiArray(response);

  return submissions.map((submission) => ({
    id: submission.id,
    title: submission.title,
    category: submission.category ?? "Uncategorized",
    notes: submission.rejectionReason ?? submission.description ?? "",
    status: mapSubmissionStatus(submission.status),
  }));
};

export const setAdminSubmissionStatus = async (
  id: string,
  status: VendorSubmission["status"]
) => {
  if (status === "accepted") {
    await apiClient<ApiEnvelope<unknown>>(`/admin/submissions/${id}/accept`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
    return;
  }

  await apiClient<ApiEnvelope<unknown>>(`/admin/submissions/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason: "Rejected by admin" }),
  });
};

export const listAdminCatalog = async (): Promise<CatalogItem[]> => {
  const response = await apiClient<ApiEnvelope<BackendCatalogProduct[]>>("/admin/catalog");
  const items = unwrapApiArray(response);

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category ?? "Uncategorized",
    status: mapCatalogStatus(item.status),
  }));
};

export const setCatalogStatus = async (
  id: string,
  status: CatalogItem["status"]
) => {
  await apiClient<ApiEnvelope<unknown>>(`/admin/catalog/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: toBackendCatalogStatus(status) }),
  });
};
