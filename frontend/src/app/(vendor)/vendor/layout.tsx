"use client";

import { useEffect, useState, type PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";
import { SquaresFour, RocketLaunch, Storefront, Package, FileArrowUp } from "@phosphor-icons/react";
import { getVendorStatus } from "@/lib/api/vendor";
import type { AccessStatus } from "@/types/operations";

const baseLinks = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: SquaresFour },
  { label: "Onboarding", href: "/vendor/dashboard", icon: RocketLaunch },
  { label: "Store", href: "/vendor/store", icon: Storefront },
];

const unlockedLinks = [
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Submissions", href: "/vendor/submissions", icon: FileArrowUp },
];

export default function VendorLayout({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AccessStatus>("setup_required");

  useEffect(() => {
    void getVendorStatus().then(setStatus);
  }, []);

  return (
    <RoleGuard role="vendor">
      <RoleLayout
        title="Vendor Console"
        links={status === "approved" ? [...baseLinks, ...unlockedLinks] : baseLinks}
      >
        {children}
      </RoleLayout>
    </RoleGuard>
  );
}
