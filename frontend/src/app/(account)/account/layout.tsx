import type { PropsWithChildren } from "react";

import { AccountGuard } from "@/components/account/AccountGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";

const accountLinks = [
  { label: "Overview", href: "/account/profile" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/wishlist" },
];

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <AccountGuard>
      <RoleLayout title="My Account" links={accountLinks}>{children}</RoleLayout>
    </AccountGuard>
  );
}
