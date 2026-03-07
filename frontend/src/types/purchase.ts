import type { ProductCardModel } from "@/types/catalog";

export type CartItem = {
  product: ProductCardModel;
  quantity: number;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type CheckoutPricing = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";

export type CustomerOrder = {
  id: string;
  items: CartItem[];
  pricing: CheckoutPricing;
  address: Address;
  status: OrderStatus;
  placedAt: string;
};
