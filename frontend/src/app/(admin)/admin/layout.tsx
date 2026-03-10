"use client";

import type { PropsWithChildren } from "react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { RoleLayout } from "@/components/app-shell/RoleLayout";
import { SquaresFour, CheckCircle, Users, Package, FileArrowUp, BookOpen, ShoppingCart, CurrencyDollar, ChartLineUp } from "@phosphor-icons/react";

const links = [
  { label: "Dashboard", href: "/admin/dashboard", icon: SquaresFour },
  { label: "Approvals", href: "/admin/approvals", icon: CheckCircle },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Submissions", href: "/admin/submissions", icon: FileArrowUp },
  { label: "Catalog", href: "/admin/catalog", icon: BookOpen },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Transactions", href: "/admin/transactions", icon: CurrencyDollar },
  { label: "Revenue", href: "/admin/revenue", icon: ChartLineUp },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard role="admin">
      <RoleLayout title="Admin Operations" links={links}>{children}</RoleLayout>
    </RoleGuard>
  );
}
