export type AccessStatus = "pending" | "approved" | "blocked" | "payment_required";

export type AdminAccountStatus = "active" | "blocked";
export type AdminOnboardingStatus =
  | "not_applicable"
  | "payment_required"
  | "setup_required"
  | "ready_for_approval"
  | "approved";
export type AdminApprovalStatus =
  | "not_applicable"
  | "pending"
  | "approved"
  | "blocked";
export type AdminApprovalTargetType = "vendor_store" | "affiliate_profile";

export type VendorStore = {
  id: string;
  name: string;
  description: string;
  supportEmail: string;
};

export type VendorProduct = {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  status: "draft" | "pending" | "approved" | "rejected";
};

export type VendorSubmission = {
  id: string;
  title: string;
  category: string;
  notes: string;
  status: "pending" | "accepted" | "rejected";
  vendorQuotedPrice: number;
  suggestedRetailPrice: number | null;
  reviewable: boolean;
};

export type AffiliateProfile = {
  id: string;
  displayName: string;
  channel: string;
  audienceRegion: string;
  status: AccessStatus;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "affiliate" | "admin";
  accountStatus: AdminAccountStatus;
  onboardingStatus: AdminOnboardingStatus;
  approvalStatus: AdminApprovalStatus;
  approvalTargetType?: AdminApprovalTargetType;
  approvalTargetId?: string;
  approvalActionable: boolean;
  approvalBlockedReason?: string;
};

export type AdminApprovalRow = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "vendor" | "affiliate";
  onboardingStatus: Exclude<AdminOnboardingStatus, "not_applicable">;
  approvalStatus: Extract<AdminApprovalStatus, "pending" | "approved" | "blocked">;
  approvalTargetType: AdminApprovalTargetType;
  approvalTargetId: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  category: string;
  status: "active" | "draft" | "archived";
};
