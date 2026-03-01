"use client"

import type React from "react"

import {
  ChartBar,
  Package,
  Plus,
  ShoppingCart,
  Storefront,
} from "@phosphor-icons/react"

import PortalShell from "@/components/portal/PortalShell"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      allowedRole="VENDOR"
      title="Vendor Workspace"
      badgeLabel="Vendor"
      menuItems={[
        { href: "/vendor", label: "Dashboard", icon: ChartBar },
        { href: "/vendor/store", label: "Store Profile", icon: Storefront },
        { href: "/vendor/products", label: "Submissions", icon: Package },
        { href: "/vendor/products/add", label: "New Submission", icon: Plus },
        { href: "/vendor/orders", label: "Orders", icon: ShoppingCart },
      ]}
    >
      {children}
    </PortalShell>
  )
}
