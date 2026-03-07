import type { PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";

const links = [
  { label: "Dashboard", href: "/affiliate/dashboard" },
  { label: "Profile", href: "/affiliate/profile" },
];

export default function AffiliateLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard role="affiliate">
      <RoleLayout title="Affiliate Workspace" links={links}>{children}</RoleLayout>
    </RoleGuard>
  );
}
