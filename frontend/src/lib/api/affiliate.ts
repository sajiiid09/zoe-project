import { apiClient } from "@/lib/api/client";
import { readStoredSession } from "@/lib/api/auth";
import type { AccessStatus, AffiliateProfile } from "@/types/operations";

const KEY = "zoe_affiliate_profile";

const readLocal = (): AffiliateProfile | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AffiliateProfile;
  } catch {
    return null;
  }
};

const writeLocal = (profile: AffiliateProfile) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
};

export const getAffiliateStatus = async (): Promise<AccessStatus> => {
  try {
    const result = await apiClient<{ status: AccessStatus }>("/affiliate/status/");
    return result.status;
  } catch {
    const session = readStoredSession();
    if (session?.user.role !== "affiliate") return "blocked";
    return readLocal()?.status ?? "payment_required";
  }
};

export const getAffiliateProfile = async (): Promise<AffiliateProfile | null> => {
  try {
    return await apiClient<AffiliateProfile>("/affiliate/profile/");
  } catch {
    return readLocal();
  }
};

export const saveAffiliateProfile = async (payload: AffiliateProfile): Promise<AffiliateProfile> => {
  try {
    return await apiClient<AffiliateProfile>("/affiliate/profile/", { method: "POST", body: JSON.stringify(payload) });
  } catch {
    writeLocal(payload);
    return payload;
  }
};
