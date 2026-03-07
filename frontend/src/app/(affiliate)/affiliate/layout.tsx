import type { PropsWithChildren } from "react";

import { RoleLayout } from "@/components/app-shell/RoleLayout";

const links = [
  { label: "Dashboard", href: "/affiliate/dashboard" },
  { label: "Profile", href: "/affiliate/profile" },
];

export default function AffiliateLayout({ children }: PropsWithChildren) {
  return <RoleLayout title="Affiliate Workspace" links={links}>{children}</RoleLayout>;
}
