import { apiClient } from "@/lib/api/client";
import { readStoredSession } from "@/lib/api/auth";
import type { AccessStatus, VendorProduct, VendorStore, VendorSubmission } from "@/types/operations";

const keyFor = (key: string) => {
  const userId = readStoredSession()?.user.id ?? "guest";
  return `zoe_${userId}_${key}`;
};

const readLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(keyFor(key));
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeLocal = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyFor(key), JSON.stringify(value));
};

export const getVendorStatus = async (): Promise<AccessStatus> => {
  try {
    const result = await apiClient<{ status: AccessStatus }>("/vendor/status/");
    return result.status;
  } catch {
    const role = readStoredSession()?.user.role;
    if (role !== "vendor") return "blocked";
    return readLocal<AccessStatus>("vendor_status", "payment_required");
  }
};

export const setVendorStatusLocal = (status: AccessStatus) => writeLocal("vendor_status", status);

export const getVendorDashboardStats = async () => {
  try {
    return await apiClient<{ products: number; submissions: number; pendingApprovals: number }>("/vendor/dashboard/stats/");
  } catch {
    const products = readLocal<VendorProduct[]>("vendor_products", []);
    const submissions = readLocal<VendorSubmission[]>("vendor_submissions", []);
    return {
      products: products.length,
      submissions: submissions.length,
      pendingApprovals: products.filter((p) => p.status === "pending").length + submissions.filter((s) => s.status === "pending").length,
    };
  }
};

export const getVendorStore = async (): Promise<VendorStore | null> => {
  try {
    return await apiClient<VendorStore>("/vendor/store/");
  } catch {
    return readLocal<VendorStore | null>("vendor_store", null);
  }
};

export const saveVendorStore = async (payload: VendorStore): Promise<VendorStore> => {
  try {
    return await apiClient<VendorStore>("/vendor/store/", { method: "POST", body: JSON.stringify(payload) });
  } catch {
    writeLocal("vendor_store", payload);
    return payload;
  }
};

export const listVendorProducts = async (): Promise<VendorProduct[]> => {
  try {
    return await apiClient<VendorProduct[]>("/vendor/products/");
  } catch {
    return readLocal<VendorProduct[]>("vendor_products", []);
  }
};

export const saveVendorProduct = async (payload: VendorProduct): Promise<VendorProduct> => {
  try {
    return await apiClient<VendorProduct>(`/vendor/products/${payload.id ? `${payload.id}/` : ""}`, {
      method: payload.id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    const list = readLocal<VendorProduct[]>("vendor_products", []);
    const id = payload.id || `vp-${Date.now()}`;
    const next = { ...payload, id };
    const idx = list.findIndex((item) => item.id === id);
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    writeLocal("vendor_products", list);
    return next;
  }
};

export const deleteVendorProduct = async (id: string): Promise<void> => {
  try {
    await apiClient<void>(`/vendor/products/${id}/`, { method: "DELETE" });
  } catch {
    writeLocal("vendor_products", readLocal<VendorProduct[]>("vendor_products", []).filter((item) => item.id !== id));
  }
};

export const listVendorSubmissions = async (): Promise<VendorSubmission[]> => {
  try {
    return await apiClient<VendorSubmission[]>("/vendor/submissions/");
  } catch {
    return readLocal<VendorSubmission[]>("vendor_submissions", []);
  }
};

export const saveVendorSubmission = async (payload: VendorSubmission): Promise<VendorSubmission> => {
  try {
    return await apiClient<VendorSubmission>(`/vendor/submissions/${payload.id ? `${payload.id}/` : ""}`, {
      method: payload.id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    const list = readLocal<VendorSubmission[]>("vendor_submissions", []);
    const id = payload.id || `vs-${Date.now()}`;
    const next = { ...payload, id };
    const idx = list.findIndex((item) => item.id === id);
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    writeLocal("vendor_submissions", list);
    return next;
  }
};

export const deleteVendorSubmission = async (id: string): Promise<void> => {
  try {
    await apiClient<void>(`/vendor/submissions/${id}/`, { method: "DELETE" });
  } catch {
    writeLocal("vendor_submissions", readLocal<VendorSubmission[]>("vendor_submissions", []).filter((item) => item.id !== id));
  }
};
