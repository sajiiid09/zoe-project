"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { List, X, ChartBar, Package, Users, ShoppingCart, TrendUp, SignOut, Storefront } from "@phosphor-icons/react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: ChartBar },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/vendors", label: "Vendors", icon: Storefront },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/revenue", label: "Revenue", icon: TrendUp },
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
          {sidebarOpen && <h1 className="font-display text-xl tracking-wide">Decormade</h1>}
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

        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2C3B2D] transition text-red-400">
            <SignOut size={20} weight="bold" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div animate={{ marginLeft: sidebarOpen ? 260 : 80 }} transition={{ duration: 0.3 }} className="flex-1">
        {/* Admin Header */}
        <div className="bg-[#FDFCFA] border-b border-[#E8E3DA] px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-medium text-[#2C3B2D]">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-[#F5F2ED] rounded-full text-xs tracking-[0.1em] uppercase text-[#6B7C5E] font-medium">Admin</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  )
}
