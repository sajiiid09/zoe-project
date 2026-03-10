"use client";

import type { PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";
import { SquaresFour, RocketLaunch, Storefront, Package, FileArrowUp } from "@phosphor-icons/react";

const links = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: SquaresFour },
  { label: "Onboarding", href: "/vendor/dashboard", icon: RocketLaunch },
  { label: "Store", href: "/vendor/store", icon: Storefront },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Submissions", href: "/vendor/submissions", icon: FileArrowUp },
];

export default function VendorLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard role="vendor">
      <RoleLayout title="Vendor Console" links={links}>{children}</RoleLayout>
    </RoleGuard>
  );
}
