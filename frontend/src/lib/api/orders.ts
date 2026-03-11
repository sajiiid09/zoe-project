import { mapBackendProductToCard } from "@/lib/api/adapters";
import { apiClient } from "@/lib/api/client";
import { unwrapApiArray, unwrapApiData, type ApiEnvelope } from "@/lib/api/response";
import type { Address, CartItem, CustomerOrder } from "@/types/purchase";

type BackendOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "paid";

type BackendOrderItem = {
  id: string;
  quantity: number;
  price: number | string;
  total: number | string;
  product?: {
    id: string;
    name: string;
    price: number | string;
    images?: unknown;
    category?: string | null;
  } | null;
};

type BackendOrder = {
  id: string;
  status: BackendOrderStatus;
  subtotal: number | string;
  shippingCost: number | string;
  tax: number | string;
  total: number | string;
  shippingAddress?: unknown;
  billingAddress?: unknown;
  items: BackendOrderItem[];
  createdAt: string;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapOrderStatus = (status: BackendOrderStatus): CustomerOrder["status"] => {
  if (status === "delivered") return "delivered";
  if (status === "shipped") return "shipped";
  if (status === "cancelled") return "cancelled";
  if (status === "processing" || status === "paid") return "processing";
  return "placed";
};

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
};

const mapAddress = (raw: unknown, fallbackId: string): Address => {
  const data = asRecord(raw);
  return {
    id: String(data.id ?? fallbackId),
    fullName: String(data.fullName ?? "Customer"),
    phone: String(data.phone ?? ""),
    line1: String(data.line1 ?? ""),
    line2:
      data.line2 === undefined || data.line2 === null ? "" : String(data.line2),
    city: String(data.city ?? ""),
    state: String(data.state ?? ""),
    zipCode: String(data.zipCode ?? ""),
    country: String(data.country ?? ""),
  };
};

const mapOrderItem = (item: BackendOrderItem): CartItem => {
  const product = item.product
    ? mapBackendProductToCard({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category ?? "General",
        price: item.product.price,
        stock: 1,
        images: item.product.images,
      })
    : mapBackendProductToCard({
        id: `unknown-${item.id}`,
        name: "Unavailable product",
        category: "General",
        price: item.price,
        stock: 0,
        images: [],
      });

  return {
    product,
    quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
  };
};

const mapOrder = (order: BackendOrder): CustomerOrder => {
  const subtotal = toNumber(order.subtotal, 0);
  const shipping = toNumber(order.shippingCost, 0);
  const tax = toNumber(order.tax, 0);
  const total = toNumber(order.total, subtotal + shipping + tax);
  const address = mapAddress(order.shippingAddress ?? order.billingAddress, order.id);

  return {
    id: order.id,
    items: order.items.map(mapOrderItem),
    pricing: {
      subtotal,
      shipping,
      tax,
      total,
    },
    address,
    status: mapOrderStatus(order.status),
    placedAt: order.createdAt,
  };
};

export const listOrders = async (): Promise<CustomerOrder[]> => {
  const response = await apiClient<ApiEnvelope<BackendOrder[]>>("/orders");
  return unwrapApiArray(response).map(mapOrder);
};

export const listAllOrders = async (): Promise<CustomerOrder[]> => {
  const response = await apiClient<ApiEnvelope<BackendOrder[]>>("/orders/admin/all");
  return unwrapApiArray(response).map(mapOrder);
};

export const getOrderById = async (id: string): Promise<CustomerOrder | null> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendOrder>>(`/orders/${id}`);
    const order = unwrapApiData<BackendOrder | null>(response, null);
    return order ? mapOrder(order) : null;
  } catch {
    return null;
  }
};

export const placeOrder = async (
  payload: Omit<CustomerOrder, "id" | "placedAt" | "status">
): Promise<CustomerOrder> => {
  const response = await apiClient<ApiEnvelope<BackendOrder>>("/orders", {
    method: "POST",
    body: JSON.stringify({
      items: payload.items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress: payload.address,
      billingAddress: payload.address,
      paymentMethod: "cod",
      notes: {
        customer: "",
      },
    }),
  });

  const order = unwrapApiData<BackendOrder | null>(response, null);
  if (!order) {
    throw new Error("Order creation returned no payload");
  }

  return mapOrder(order);
};

export const cancelOrder = async (id: string): Promise<CustomerOrder | null> => {
  try {
    const response = await apiClient<ApiEnvelope<BackendOrder>>(`/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
    const order = unwrapApiData<BackendOrder | null>(response, null);
    return order ? mapOrder(order) : null;
  } catch {
    return null;
  }
};
