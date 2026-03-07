import { apiClient } from "@/lib/api/client";
import type { CustomerOrder } from "@/types/purchase";

const ORDER_KEY = "zoe_market_orders";

const readLocal = (): CustomerOrder[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ORDER_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CustomerOrder[];
  } catch {
    return [];
  }
};

const writeLocal = (orders: CustomerOrder[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
};

export const listOrders = async (): Promise<CustomerOrder[]> => {
  try {
    return await apiClient<CustomerOrder[]>("/orders/");
  } catch {
    return readLocal();
  }
};

export const getOrderById = async (id: string): Promise<CustomerOrder | null> => {
  try {
    return await apiClient<CustomerOrder>(`/orders/${id}/`);
  } catch {
    return readLocal().find((item) => item.id === id) ?? null;
  }
};

export const placeOrder = async (payload: Omit<CustomerOrder, "id" | "placedAt" | "status">): Promise<CustomerOrder> => {
  try {
    return await apiClient<CustomerOrder>("/orders/", { method: "POST", body: JSON.stringify(payload) });
  } catch {
    const order: CustomerOrder = {
      ...payload,
      id: `ZOE-${Math.floor(100000 + Math.random() * 900000)}`,
      placedAt: new Date().toISOString(),
      status: "placed",
    };
    writeLocal([order, ...readLocal()]);
    return order;
  }
};

export const cancelOrder = async (id: string): Promise<CustomerOrder | null> => {
  try {
    return await apiClient<CustomerOrder>(`/orders/${id}/cancel/`, { method: "POST" });
  } catch {
    const orders = readLocal();
    const idx = orders.findIndex((item) => item.id === id);
    if (idx < 0) return null;
    orders[idx] = { ...orders[idx], status: "cancelled" };
    writeLocal(orders);
    return orders[idx];
  }
};
