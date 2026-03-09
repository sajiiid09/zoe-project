import type { PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Approvals", href: "/admin/approvals" },
  { label: "Users", href: "/admin/users" },
  { label: "Products", href: "/admin/products" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Catalog", href: "/admin/catalog" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Transactions", href: "/admin/transactions" },
  { label: "Revenue", href: "/admin/revenue" },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard role="admin">
      <RoleLayout title="Admin Operations" links={links}>{children}</RoleLayout>
    </RoleGuard>
  );
}
