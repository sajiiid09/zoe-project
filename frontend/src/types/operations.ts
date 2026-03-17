export type AccessStatus =
  | "setup_required"
  | "payment_required"
  | "pending"
  | "approved"
  | "needs_changes"
  | "blocked";

export type AdminAccountStatus = "active" | "blocked";
export type AdminOnboardingStatus =
  | "not_applicable"
  | "setup_required"
  | "payment_required"
  | "pending"
  | "approved"
  | "needs_changes";
export type AdminApprovalStatus =
  | "not_applicable"
  | "pending"
  | "approved"
  | "needs_changes";
export type AdminApprovalTargetType = "vendor_store" | "affiliate_profile";

export type VendorStore = {
  id: string;
  name: string;
  slug?: string;
  description: string;
  supportEmail: string;
  phone: string;
  address: string;
  logo: string;
  banner: string;
  reviewStatus?: Exclude<AccessStatus, "blocked">;
  rejectionNote?: string;
};

export type VendorProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: "draft" | "pending" | "approved" | "rejected";
  rejectionNote?: string;
  storeName?: string;
  vendorName?: string;
};

export type VendorSubmission = {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  status: "pending" | "accepted" | "rejected";
  vendorQuotedPrice: number;
  suggestedRetailPrice: number | null;
  stockAvailable: number;
  currency: string;
  reviewable: boolean;
  rejectionReason?: string;
  notes: string;
  storeName?: string;
  vendorName?: string;
};

export type AffiliateProfile = {
  id: string;
  displayName: string;
  channel: string;
  audienceRegion: string;
  status: AccessStatus;
  rejectionNote?: string;
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
  approvalNote?: string;
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  rejectionNote?: string;
};

export type AdminApprovalRow = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "vendor" | "affiliate";
  onboardingStatus: Exclude<AdminOnboardingStatus, "not_applicable">;
  approvalStatus: Extract<AdminApprovalStatus, "pending" | "approved" | "needs_changes">;
  approvalTargetType: AdminApprovalTargetType;
  approvalTargetId: string;
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  rejectionNote?: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  category: string;
  status: "active" | "draft" | "archived";
};
