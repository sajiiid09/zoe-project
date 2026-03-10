"use client";

import type { PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";
import { SquaresFour, UserCircle } from "@phosphor-icons/react";

const links = [
  { label: "Dashboard", href: "/affiliate/dashboard", icon: SquaresFour },
  { label: "Profile", href: "/affiliate/profile", icon: UserCircle },
];

export default function AffiliateLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard role="affiliate">
      <RoleLayout title="Affiliate Workspace" links={links}>{children}</RoleLayout>
    </RoleGuard>
  );
}
