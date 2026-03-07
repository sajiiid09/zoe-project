import type { PropsWithChildren } from "react";

import { RoleLayout } from "@/components/app-shell/RoleLayout";

const accountLinks = [
  { label: "Profile", href: "/account/profile" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Orders", href: "/account/orders" },
];

export default function AccountLayout({ children }: PropsWithChildren) {
  return <RoleLayout title="Customer Account" links={accountLinks}>{children}</RoleLayout>;
}
