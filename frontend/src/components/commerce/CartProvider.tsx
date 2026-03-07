"use client";

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import type { ProductCardModel } from "@/types/catalog";
import type { CartItem, CheckoutPricing } from "@/types/purchase";

const CART_STORAGE_KEY = "zoe_market_cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  pricing: CheckoutPricing;
  addItem: (product: ProductCardModel) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const SHIPPING_BASE = 7;
const TAX_RATE = 0.05;

const buildPricing = (items: CartItem[]): CheckoutPricing => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price.amount * item.quantity, 0);
  const shipping = subtotal > 80 || subtotal === 0 ? 0 : SHIPPING_BASE;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
};

const loadInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: ProductCardModel) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (!exists) return [...prev, { product, quantity: 1 }];
      return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    });
  };

  const updateQty = (productId: string, quantity: number) => {
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, itemCount, pricing: buildPricing(items), addItem, updateQty, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
