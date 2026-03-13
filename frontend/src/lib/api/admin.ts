import { ApiError, apiClient } from "@/lib/api/client";
import { listAllOrders } from "@/lib/api/orders";
import { unwrapApiArray, type ApiEnvelope } from "@/lib/api/response";
import type {
  AdminApprovalRow,
  AdminApprovalStatus,
  AdminApprovalTargetType,
  AdminUserRow,
  CatalogItem,
  VendorProduct,
  VendorSubmission,
} from "@/types/operations";

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
    name?: string | null;
    approvalStatus: BackendApprovalStatus;
    email?: string | null;
  } | null;
};

type BackendVendor = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  store?: {
    id: string;
    name?: string | null;
    email?: string | null;
    approvalStatus: BackendApprovalStatus;
  } | null;
};

type BackendAffiliateProfile = {
  id: string;
  displayName?: string | null;
  bio?: string | null;
  website?: string | null;
  approvalStatus: BackendApprovalStatus;
  rejectionNote?: string | null;
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
  vendorQuotedPrice: number | string;
  suggestedRetailPrice?: number | string | null;
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

const toFullName = (
  firstName?: string | null,
  lastName?: string | null,
  fallback = "Unknown User"
) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || fallback;
};

const mapRole = (role: BackendUserRole): AdminUserRow["role"] => {
  if (role === "ADMIN") return "admin";
  if (role === "VENDOR") return "vendor";
  if (role === "AFFILIATE") return "affiliate";
  return "customer";
};

const mapApprovalStatus = (
  status?: BackendApprovalStatus | null
): Extract<AdminApprovalStatus, "pending" | "approved" | "needs_changes"> => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "needs_changes";
  return "pending";
};

const isVendorStoreComplete = (
  store?: { name?: string | null; email?: string | null } | null
) => {
  return Boolean(store?.name?.trim() && store?.email?.trim());
};

const isAffiliateProfileComplete = (
  profile?: { displayName?: string | null; bio?: string | null; website?: string | null } | null
) => {
  return Boolean(
    profile?.displayName?.trim() && profile?.bio?.trim() && profile?.website?.trim()
  );
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

const buildDefaultUserState = (
  user: BackendUser,
  role: AdminUserRow["role"]
): AdminUserRow => ({
  id: user.id,
  name: toFullName(user.firstName, user.lastName, user.email),
  email: user.email,
  role,
  accountStatus: user.isActive ? "active" : "blocked",
  onboardingStatus: role === "admin" || role === "customer" ? "not_applicable" : "setup_required",
  approvalStatus: "not_applicable",
  approvalActionable: false,
});

const buildVendorRow = (
  user: BackendUser,
  baseRow: AdminUserRow,
  vendorByUserId: Map<string, BackendVendor>
): AdminUserRow => {
  const store = vendorByUserId.get(user.id)?.store ?? user.store ?? null;
  const storeComplete = isVendorStoreComplete(store);

  if (!store || !storeComplete) {
    return {
      ...baseRow,
      onboardingStatus: "setup_required",
      approvalNote: "Vendor has not completed store setup yet.",
    };
  }

  if (!user.vendorFeePaid) {
    return {
      ...baseRow,
      onboardingStatus: "payment_required",
      approvalNote: "Vendor has completed setup but still needs to pay before review.",
    };
  }

  const approvalStatus = mapApprovalStatus(store.approvalStatus);

  return {
    ...baseRow,
    onboardingStatus:
      approvalStatus === "approved"
        ? "approved"
        : approvalStatus === "needs_changes"
          ? "needs_changes"
          : "pending",
    approvalStatus,
    approvalTargetType: "vendor_store",
    approvalTargetId: store.id,
    approvalActionable: baseRow.accountStatus === "active" && approvalStatus === "pending",
    approvalNote:
      baseRow.accountStatus === "blocked"
        ? "Account is blocked."
        : approvalStatus === "needs_changes"
          ? "Vendor store needs revisions before it can be approved."
          : undefined,
  };
};

const buildAffiliateRow = (
  user: BackendUser,
  baseRow: AdminUserRow,
  affiliateByUserId: Map<string, BackendAffiliateProfile>
): AdminUserRow => {
  const profile = affiliateByUserId.get(user.id) ?? null;
  const profileComplete = isAffiliateProfileComplete(profile);

  if (!profile || !profileComplete) {
    return {
      ...baseRow,
      onboardingStatus: "setup_required",
      approvalNote: "Affiliate has not completed the profile yet.",
    };
  }

  if (!user.affiliateFeePaid) {
    return {
      ...baseRow,
      onboardingStatus: "payment_required",
      approvalNote: "Affiliate has completed setup but still needs to pay before review.",
    };
  }

  const approvalStatus = mapApprovalStatus(profile.approvalStatus);

  return {
    ...baseRow,
    onboardingStatus:
      approvalStatus === "approved"
        ? "approved"
        : approvalStatus === "needs_changes"
          ? "needs_changes"
          : "pending",
    approvalStatus,
    approvalTargetType: "affiliate_profile",
    approvalTargetId: profile.id,
    approvalActionable: baseRow.accountStatus === "active" && approvalStatus === "pending",
    approvalNote:
      baseRow.accountStatus === "blocked"
        ? "Account is blocked."
        : approvalStatus === "needs_changes"
          ? "Affiliate profile needs revisions before it can be approved."
          : undefined,
  };
};

const toApprovalRow = (row: AdminUserRow): AdminApprovalRow | null => {
  if (
    !row.approvalActionable ||
    row.approvalStatus !== "pending" ||
    !row.approvalTargetType ||
    !row.approvalTargetId ||
    (row.role !== "vendor" && row.role !== "affiliate")
  ) {
    return null;
  }

  return {
    id: `${row.role}:${row.approvalTargetId}`,
    userId: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    onboardingStatus:
      row.onboardingStatus === "not_applicable" ? "pending" : row.onboardingStatus,
    approvalStatus: row.approvalStatus,
    approvalTargetType: row.approvalTargetType,
    approvalTargetId: row.approvalTargetId,
  };
};

const fetchAdminUsersState = async () => {
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
      .filter(
        (
          profile
        ): profile is BackendAffiliateProfile & {
          user: NonNullable<BackendAffiliateProfile["user"]>;
        } => Boolean(profile.user)
      )
      .map((profile) => [profile.user.id, profile])
  );

  const rows: AdminUserRow[] = users.map((user) => {
    const role = mapRole(user.role);
    const baseRow = buildDefaultUserState(user, role);

    if (role === "vendor") {
      return buildVendorRow(user, baseRow, vendorByUserId);
    }

    if (role === "affiliate") {
      return buildAffiliateRow(user, baseRow, affiliateByUserId);
    }

    return {
      ...baseRow,
      onboardingStatus: "not_applicable",
    };
  });

  const approvalQueue = rows
    .map(toApprovalRow)
    .filter((row): row is AdminApprovalRow => Boolean(row));

  return { rows, approvalQueue };
};

export const readAdminErrorMessage = (error: unknown, fallback = "Could not update right now.") => {
  if (error instanceof ApiError) {
    const details = error.details;
    if (!details || typeof details !== "object") {
      return fallback;
    }

    const message = (details as Record<string, unknown>).message;
    return typeof message === "string" ? message : fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getAdminDashboardStats = async () => {
  const [{ rows, approvalQueue }, submissions, orders] = await Promise.all([
    fetchAdminUsersState(),
    listAdminSubmissions(),
    listAllOrders(),
  ]);

  return {
    users: rows.length,
    pendingApprovals: approvalQueue.length,
    pendingSubmissions: submissions.filter((submission) => submission.status === "pending").length,
    orders: orders.length,
  };
};

export const listAdminUsers = async (): Promise<AdminUserRow[]> => {
  const { rows } = await fetchAdminUsersState();
  return rows;
};

export const listAdminApprovalQueue = async (): Promise<AdminApprovalRow[]> => {
  const { approvalQueue } = await fetchAdminUsersState();
  return approvalQueue;
};

export const setAdminAccountActive = async (id: string, isActive: boolean) => {
  await apiClient<ApiEnvelope<unknown>>(`/users/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });
};

export const setAdminApprovalStatus = async (
  target: {
    approvalTargetType: AdminApprovalTargetType;
    approvalTargetId: string;
  },
  status: Extract<AdminApprovalStatus, "approved" | "needs_changes">
) => {
  const path =
    target.approvalTargetType === "vendor_store"
      ? status === "approved"
        ? `/users/admin/vendors/${target.approvalTargetId}/approve`
        : `/users/admin/vendors/${target.approvalTargetId}/reject`
      : status === "approved"
        ? `/users/admin/affiliates/${target.approvalTargetId}/approve`
        : `/users/admin/affiliates/${target.approvalTargetId}/reject`;

  const body = status === "approved" ? {} : { reason: "Changes requested by admin" };

  await apiClient<ApiEnvelope<unknown>>(path, {
    method: "PUT",
    body: JSON.stringify(body),
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
    vendorQuotedPrice: toNumber(submission.vendorQuotedPrice, 0),
    suggestedRetailPrice:
      submission.suggestedRetailPrice === null || submission.suggestedRetailPrice === undefined
        ? null
        : toNumber(submission.suggestedRetailPrice, 0),
    reviewable: submission.status === "SUBMITTED" || submission.status === "UNDER_REVIEW",
  }));
};

export const setAdminSubmissionStatus = async (input: {
  id: string;
  status: VendorSubmission["status"];
  retailPrice?: number;
}) => {
  if (input.status === "accepted") {
    if (input.retailPrice === undefined || input.retailPrice <= 0) {
      throw new Error("A positive retail price is required to accept a submission.");
    }

    await apiClient<ApiEnvelope<unknown>>(`/admin/submissions/${input.id}/accept`, {
      method: "PUT",
      body: JSON.stringify({ retailPrice: input.retailPrice }),
    });
    return;
  }

  await apiClient<ApiEnvelope<unknown>>(`/admin/submissions/${input.id}/reject`, {
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
