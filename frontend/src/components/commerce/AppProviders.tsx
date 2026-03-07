"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/commerce/CartProvider";
import { WishlistProvider } from "@/components/commerce/WishlistProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};
