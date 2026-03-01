"use client"

import type React from "react"

import { ChartBar, UserCircle } from "@phosphor-icons/react"

import PortalShell from "@/components/portal/PortalShell"

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalShell
      allowedRole="AFFILIATE"
      title="Affiliate Studio"
      badgeLabel="Affiliate"
      menuItems={[
        { href: "/affiliate", label: "Dashboard", icon: ChartBar },
        { href: "/affiliate/profile", label: "Profile", icon: UserCircle },
      ]}
    >
      {children}
    </PortalShell>
  )
}
