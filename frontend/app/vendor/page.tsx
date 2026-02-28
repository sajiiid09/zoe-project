"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, ShoppingCart, TrendUp, Clock, CheckCircle, XCircle, Storefront } from "@phosphor-icons/react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface DashboardData {
  hasStore: boolean
  store?: { id: string; name: string; approvalStatus: string }
  stats?: {
    totalProducts: number
    pendingProducts: number
    approvedProducts: number
    rejectedProducts: number
    totalOrders: number
    totalRevenue: number
  }
}

export default function VendorDashboard() {
  const { token } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/vendor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchDashboard()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#546A50] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data?.hasStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Storefront size={64} weight="duotone" className="text-[#546A50] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#546A50] mb-2">Welcome, Vendor!</h2>
          <p className="text-[#B5B89B] mb-6 max-w-md">
            You haven&apos;t created your store yet. Set up your store to start listing products on Decormade.
          </p>
          <Link
            href="/vendor/store"
            className="inline-flex items-center gap-2 bg-[#546A50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3F4E40] transition"
          >
            <Storefront size={20} weight="bold" /> Create Your Store
          </Link>
        </motion.div>
      </div>
    )
  }

  const store = data.store!
  const stats = data.stats!

  const storeStatusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  }

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "#546A50" },
    { label: "Approved", value: stats.approvedProducts, icon: CheckCircle, color: "#7EBAAD" },
    { label: "Pending", value: stats.pendingProducts, icon: Clock, color: "#D2A880" },
    { label: "Rejected", value: stats.rejectedProducts, icon: XCircle, color: "#B5B89B" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "#546A50" },
    { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: TrendUp, color: "#7EBAAD" },
  ]

  return (
    <div className="space-y-6">
      {/* Store status banner */}
      {store.approvalStatus !== "APPROVED" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            store.approvalStatus === "PENDING"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <p className="font-semibold">
            {store.approvalStatus === "PENDING"
              ? "Your store is pending admin approval. You can set up your products, but they won't be visible until your store is approved."
              : "Your store application was rejected. Please contact support for more information."}
          </p>
        </motion.div>
      )}

      {/* Store name + status */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-[#546A50]">{store.name}</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${storeStatusColors[store.approvalStatus]}`}>
          {store.approvalStatus}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-lg p-5 shadow-sm border border-[#E5E0D8]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#B5B89B] text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#546A50] mt-1">{stat.value}</p>
                </div>
                <Icon size={28} weight="duotone" color={stat.color} className="opacity-40" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/vendor/products/add"
          className="flex items-center gap-3 bg-white p-5 rounded-lg border border-[#E5E0D8] hover:border-[#546A50] transition group"
        >
          <Package size={24} weight="duotone" className="text-[#546A50]" />
          <div>
            <p className="font-semibold text-[#546A50] group-hover:text-[#3F4E40] transition">Add New Product</p>
            <p className="text-sm text-[#B5B89B]">List a new product for approval</p>
          </div>
        </Link>
        <Link
          href="/vendor/store"
          className="flex items-center gap-3 bg-white p-5 rounded-lg border border-[#E5E0D8] hover:border-[#546A50] transition group"
        >
          <Storefront size={24} weight="duotone" className="text-[#546A50]" />
          <div>
            <p className="font-semibold text-[#546A50] group-hover:text-[#3F4E40] transition">Edit Store Profile</p>
            <p className="text-sm text-[#B5B89B]">Update your store information</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
