"use client";

import type { PropsWithChildren } from "react";

import { AccountGuard } from "@/components/account/AccountGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";
import { User, MapPin, Bag, Heart } from "@phosphor-icons/react";

const accountLinks = [
  { label: "Overview", href: "/account/profile", icon: User },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Orders", href: "/account/orders", icon: Bag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <AccountGuard>
      <RoleLayout title="My Account" links={accountLinks}>{children}</RoleLayout>
    </AccountGuard>
  );
}
