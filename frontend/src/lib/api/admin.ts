import { apiClient } from "@/lib/api/client";
import { listOrders } from "@/lib/api/orders";
import { listVendorProducts, listVendorSubmissions, saveVendorProduct, saveVendorSubmission } from "@/lib/api/vendor";
import type { AdminUserRow, CatalogItem, VendorProduct, VendorSubmission } from "@/types/operations";

const USERS_KEY = "zoe_market_users";
const CATALOG_KEY = "zoe_admin_catalog";

const readLocalUsers = (): AdminUserRow[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const users = JSON.parse(raw) as Array<{ id: string; fullName: string; email: string; role: AdminUserRow["role"]; isPaid?: boolean }>;
    return users.map((u) => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      status: u.role === "customer" || u.role === "admin" ? "approved" : u.isPaid ? "approved" : "payment_required",
    }));
  } catch {
    return [];
  }
};

const writeLocalUsers = (rows: AdminUserRow[]) => {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return;
  try {
    const users = JSON.parse(raw) as Array<{ id: string; fullName: string; email: string; role: AdminUserRow["role"]; isPaid?: boolean }>;
    const next = users.map((u) => {
      const row = rows.find((r) => r.id === u.id);
      if (!row) return u;
      return { ...u, isPaid: row.status === "approved" };
    });
    window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
  } catch {
    // noop
  }
};

const readCatalog = (): CatalogItem[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CATALOG_KEY);
  if (!raw) {
    const seeded: CatalogItem[] = [
      { id: "c1", title: "Premium Headphones", category: "Electronics", status: "active" },
      { id: "c2", title: "Kitchen Blender", category: "Home", status: "draft" },
      { id: "c3", title: "Running Jacket", category: "Fashion", status: "active" },
    ];
    window.localStorage.setItem(CATALOG_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as CatalogItem[];
  } catch {
    return [];
  }
};

const writeCatalog = (items: CatalogItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CATALOG_KEY, JSON.stringify(items));
};

export const getAdminDashboardStats = async () => {
  try {
    return await apiClient<{ users: number; pendingApprovals: number; pendingSubmissions: number; orders: number }>("/admin/stats/");
  } catch {
    const users = readLocalUsers();
    const submissions = await listVendorSubmissions();
    const orders = await listOrders();
    return {
      users: users.length,
      pendingApprovals: users.filter((u) => u.status === "pending" || u.status === "payment_required").length,
      pendingSubmissions: submissions.filter((s) => s.status === "pending").length,
      orders: orders.length,
    };
  }
};

export const listAdminUsers = async (): Promise<AdminUserRow[]> => {
  try {
    return await apiClient<AdminUserRow[]>("/admin/users/");
  } catch {
    return readLocalUsers();
  }
};

export const setAdminUserStatus = async (id: string, status: AdminUserRow["status"]) => {
  try {
    await apiClient<void>(`/admin/users/${id}/status/`, { method: "POST", body: JSON.stringify({ status }) });
  } catch {
    const users = readLocalUsers().map((item) => (item.id === id ? { ...item, status } : item));
    writeLocalUsers(users);
  }
};

export const listAdminProducts = async (): Promise<VendorProduct[]> => {
  try {
    return await apiClient<VendorProduct[]>("/admin/products/review/");
  } catch {
    return listVendorProducts();
  }
};

export const setAdminProductStatus = async (id: string, status: VendorProduct["status"]) => {
  try {
    await apiClient<void>(`/admin/products/${id}/status/`, { method: "POST", body: JSON.stringify({ status }) });
  } catch {
    const list = await listVendorProducts();
    const target = list.find((item) => item.id === id);
    if (!target) return;
    await saveVendorProduct({ ...target, status });
  }
};

export const listAdminSubmissions = async (): Promise<VendorSubmission[]> => {
  try {
    return await apiClient<VendorSubmission[]>("/admin/submissions/review/");
  } catch {
    return listVendorSubmissions();
  }
};

export const setAdminSubmissionStatus = async (id: string, status: VendorSubmission["status"]) => {
  try {
    await apiClient<void>(`/admin/submissions/${id}/status/`, { method: "POST", body: JSON.stringify({ status }) });
  } catch {
    const list = await listVendorSubmissions();
    const target = list.find((item) => item.id === id);
    if (!target) return;
    await saveVendorSubmission({ ...target, status });
  }
};

export const listAdminCatalog = async (): Promise<CatalogItem[]> => {
  try {
    return await apiClient<CatalogItem[]>("/admin/catalog/");
  } catch {
    return readCatalog();
  }
};

export const setCatalogStatus = async (id: string, status: CatalogItem["status"]) => {
  try {
    await apiClient<void>(`/admin/catalog/${id}/`, { method: "PATCH", body: JSON.stringify({ status }) });
  } catch {
    const list = readCatalog().map((item) => (item.id === id ? { ...item, status } : item));
    writeCatalog(list);
  }
};
