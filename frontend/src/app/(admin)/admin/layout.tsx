import type { PropsWithChildren } from "react";

import { RoleLayout } from "@/components/app-shell/RoleLayout";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Approvals", href: "/admin/approvals" },
  { label: "Catalog", href: "/admin/catalog" },
  { label: "Users", href: "/admin/users" },
  { label: "Orders", href: "/admin/orders" },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  return <RoleLayout title="Admin Control" links={links}>{children}</RoleLayout>;
}
