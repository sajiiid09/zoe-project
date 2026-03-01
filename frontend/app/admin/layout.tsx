"use client"

import type React from "react"

import {
  ChartBar,
  CurrencyCircleDollar,
  Package,
  ShoppingCart,
  Storefront,
  Users,
  UserSwitch,
} from "@phosphor-icons/react"

import PortalShell from "@/components/portal/PortalShell"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      allowedRole="ADMIN"
      title="Admin Control"
      badgeLabel="Admin"
      menuItems={[
        { href: "/admin", label: "Dashboard", icon: ChartBar },
        { href: "/admin/products", label: "Catalog", icon: Package },
        { href: "/admin/vendors", label: "Vendors", icon: Storefront },
        { href: "/admin/affiliates", label: "Affiliates", icon: UserSwitch },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/revenue", label: "Revenue", icon: CurrencyCircleDollar },
      ]}
    >
      {children}
    </PortalShell>
  )
}
