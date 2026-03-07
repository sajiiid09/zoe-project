"use client";

import type { PropsWithChildren } from "react";

import { CartProvider } from "@/components/commerce/CartProvider";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return <CartProvider>{children}</CartProvider>;
};
