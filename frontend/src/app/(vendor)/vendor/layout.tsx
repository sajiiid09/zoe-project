import type { PropsWithChildren } from "react";

import { RoleLayout } from "@/components/app-shell/RoleLayout";

const links = [
  { label: "Dashboard", href: "/vendor/dashboard" },
  { label: "Store", href: "/vendor/store" },
  { label: "Products", href: "/vendor/products" },
  { label: "Submissions", href: "/vendor/submissions" },
];

export default function VendorLayout({ children }: PropsWithChildren) {
  return <RoleLayout title="Vendor Console" links={links}>{children}</RoleLayout>;
}
