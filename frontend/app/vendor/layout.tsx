"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { List, X, ChartBar, Package, Storefront, ShoppingCart, SignOut, Plus } from "@phosphor-icons/react"
import { useAuth } from "@/context/AuthContext"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "VENDOR")) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && user?.role === "VENDOR" && !user?.vendorFeePaid) {
      router.push("/vendor-payment")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== "VENDOR" || !user?.vendorFeePaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2ED]">
        <div className="w-8 h-8 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const menuItems = [
    { href: "/vendor", label: "Dashboard", icon: ChartBar },
    { href: "/vendor/store", label: "My Store", icon: Storefront },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/vendor/products/add", label: "Add Product", icon: Plus },
    { href: "/vendor/orders", label: "Orders", icon: ShoppingCart },
  ]

  return (
    <div className="flex min-h-screen bg-[#F5F2ED]">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-[#3D5A3E] text-white shadow-lg fixed h-screen left-0 top-0 overflow-hidden z-40"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/" className="font-display text-xl tracking-wide hover:text-[#C7956D] transition">
              Decormade
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#2C3B2D] rounded transition">
            {sidebarOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>

        <nav className="px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2C3B2D] transition group"
              >
                <Icon size={20} weight="bold" />
                {sidebarOpen && <span className="group-hover:translate-x-1 transition">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-3 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2C3B2D] transition text-[#8AADA0]"
          >
            <Storefront size={20} weight="bold" />
            {sidebarOpen && <span>Back to Shop</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2C3B2D] transition text-red-400"
          >
            <SignOut size={20} weight="bold" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div animate={{ marginLeft: sidebarOpen ? 260 : 80 }} transition={{ duration: 0.3 }} className="flex-1">
        <div className="bg-[#FDFCFA] border-b border-[#E8E3DA] px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-medium text-[#2C3B2D]">Vendor Dashboard</h2>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-[#F5F2ED] rounded-full text-xs tracking-[0.1em] uppercase text-[#6B7C5E] font-medium">
                {user?.firstName || "Vendor"}
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  )
}
