export type AccessStatus = "pending" | "approved" | "blocked" | "payment_required";

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
  status: AccessStatus;
  vendorStoreId?: string;
  affiliateProfileId?: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  category: string;
  status: "active" | "draft" | "archived";
};
