import { ApiError, apiClient } from "@/lib/api/client";
import { readStoredSession } from "@/lib/api/auth";
import { getAffiliateFeeStatus } from "@/lib/api/payments";
import { unwrapApiData, type ApiEnvelope } from "@/lib/api/response";
import type { AccessStatus, AffiliateProfile } from "@/types/operations";

type BackendApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type BackendAffiliateProfile = {
  id: string;
  displayName?: string | null;
  bio?: string | null;
  website?: string | null;
  approvalStatus: BackendApprovalStatus;
};

const mapApprovalStatus = (status?: BackendApprovalStatus): AccessStatus => {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "blocked";
  return "pending";
};

const mapProfile = (
  profile: BackendAffiliateProfile
): AffiliateProfile => ({
  id: profile.id,
  displayName: profile.displayName ?? "",
  channel: profile.website ?? "",
  audienceRegion: profile.bio ?? "",
  status: mapApprovalStatus(profile.approvalStatus),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)+/g, "");

const buildReferralCode = (displayName: string) => {
  const base = slugify(displayName).slice(0, 18) || "affiliate";
  return `${base}_${Date.now().toString(36)}`.toUpperCase();
};

export const getAffiliateStatus = async (): Promise<AccessStatus> => {
  const session = readStoredSession();
  if (session?.user.role !== "affiliate") return "blocked";

  try {
    const feePaid = await getAffiliateFeeStatus();
    if (!feePaid) {
      return "payment_required";
    }

    const profile = await getAffiliateProfile();
    return profile?.status ?? "pending";
  } catch {
    return "pending";
  }
};

export const getAffiliateProfile = async (): Promise<AffiliateProfile | null> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendAffiliateProfile>>(
      "/affiliate/profile"
    );
    const profile = unwrapApiData<BackendAffiliateProfile | null>(response, null);
    return profile ? mapProfile(profile) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveAffiliateProfile = async (
  payload: AffiliateProfile
): Promise<AffiliateProfile> => {
  const method = payload.id ? "PUT" : "POST";
  const body =
    method === "POST"
      ? {
          displayName: payload.displayName,
          referralCode: buildReferralCode(payload.displayName),
          bio: payload.audienceRegion || null,
          website: payload.channel || null,
        }
      : {
          displayName: payload.displayName,
          bio: payload.audienceRegion || null,
          website: payload.channel || null,
        };

  const response = await apiClient<ApiEnvelope<BackendAffiliateProfile>>(
    "/affiliate/profile",
    {
      method,
      body: JSON.stringify(body),
    }
  );

  const profile = unwrapApiData<BackendAffiliateProfile | null>(response, null);
  if (!profile) {
    throw new Error("Affiliate profile save returned no payload");
  }

  return mapProfile(profile);
};
