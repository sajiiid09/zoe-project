"use client";

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import type { ProductCardModel } from "@/types/catalog";

const KEY = "zoe_market_wishlist";

type WishlistContextValue = {
  items: ProductCardModel[];
  toggleWishlist: (product: ProductCardModel) => void;
  isWishlisted: (productId: string) => boolean;
  removeWishlisted: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const loadInitial = (): ProductCardModel[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ProductCardModel[];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<ProductCardModel[]>(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product: ProductCardModel) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [product, ...prev];
    });
  };

  const removeWishlisted = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isWishlisted = (productId: string) => items.some((item) => item.id === productId);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, removeWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
