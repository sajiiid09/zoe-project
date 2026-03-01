"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { List, SignOut, Storefront, X } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { useAuth } from "@/context/AuthContext"
import { getDefaultRouteForUser, getPaymentRouteForRole } from "@/lib/auth"

interface MenuItem {
  href: string
  label: string
  icon: any
}

interface PortalShellProps {
  allowedRole: "ADMIN" | "VENDOR" | "AFFILIATE"
  title: string
  badgeLabel: string
  menuItems: MenuItem[]
  children: React.ReactNode
}

export default function PortalShell({
  allowedRole,
  title,
  badgeLabel,
  menuItems,
  children,
}: PortalShellProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (user?.role !== allowedRole) {
      router.replace(getDefaultRouteForUser(user))
      return
    }

    const paymentRoute = getPaymentRouteForRole(user.role)

    if (user.role === "VENDOR" && !user.vendorFeePaid && paymentRoute) {
      router.replace(paymentRoute)
      return
    }

    if (user.role === "AFFILIATE" && !user.affiliateFeePaid && paymentRoute) {
      router.replace(paymentRoute)
    }
  }, [allowedRole, isAuthenticated, isLoading, router, user])

  const isBlocked =
    isLoading ||
    !isAuthenticated ||
    !user ||
    user.role !== allowedRole ||
    (allowedRole === "VENDOR" && !user.vendorFeePaid) ||
    (allowedRole === "AFFILIATE" && !user.affiliateFeePaid)

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2ED]">
        <div className="w-9 h-9 rounded-full border-4 border-[#3D5A3E] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5F2ED]">
      <motion.aside
        animate={{ width: sidebarOpen ? 272 : 84 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed left-0 top-0 z-40 h-screen overflow-hidden border-r border-[#284029] bg-[linear-gradient(180deg,#365337_0%,#2C3B2D_100%)] text-white shadow-xl"
      >
        <div className="flex items-center justify-between p-6">
          {sidebarOpen ? (
            <Link href="/" className="font-display text-xl tracking-[0.02em] text-[#FDFCFA]">
              Decormade
            </Link>
          ) : (
            <Link href="/" className="mx-auto text-[#FDFCFA]">
              <Storefront size={24} weight="duotone" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="rounded-lg p-2 text-[#FDFCFA]/80 transition hover:bg-white/10 hover:text-white"
          >
            {sidebarOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>

        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== `/${allowedRole.toLowerCase()}` &&
                pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/14 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-[#D6E1D1] hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "duotone"} />
                {sidebarOpen && (
                  <span className="transition group-hover:translate-x-0.5">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-6 px-3">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#A8C6AF] transition hover:bg-white/8 hover:text-white"
          >
            <Storefront size={20} weight="duotone" />
            {sidebarOpen && <span>Marketplace</span>}
          </Link>

          <button
            type="button"
            onClick={() => {
              logout()
              router.replace("/")
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#F2B8B8] transition hover:bg-white/8 hover:text-[#FFD7D7]"
          >
            <SignOut size={20} weight="duotone" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 272 : 84 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="min-w-0 flex-1"
      >
        <header className="sticky top-0 z-30 border-b border-[#E8E3DA] bg-[#FDFCFA]/92 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
                Portal
              </p>
              <h1 className="font-display text-3xl font-medium text-[#2C3B2D]">{title}</h1>
            </div>

            <div className="rounded-full bg-[#F5F2ED] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4F6A51]">
              {badgeLabel}
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  )
}
