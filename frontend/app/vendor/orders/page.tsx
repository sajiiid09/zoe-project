"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart } from "@phosphor-icons/react"
import { useAuth } from "@/context/AuthContext"

interface OrderItem {
  orderId: string
  total: number
}

export default function VendorOrdersPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orders] = useState<OrderItem[]>([])

  useEffect(() => {
    // Orders endpoint would require a dedicated vendor orders API
    // For now, show a placeholder that the vendor can see stats from the dashboard
    setLoading(false)
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3D5A3E]">Orders</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 bg-[#FDFCFA] rounded-xl border border-[#E8E3DA] shadow-sm"
      >
        <ShoppingCart size={48} weight="duotone" className="text-[#6B7C5E] mb-4" />
        <h2 className="text-xl font-semibold text-[#3D5A3E] mb-2">Order tracking</h2>
        <p className="text-[#6B7C5E] text-sm text-center max-w-md">
          Once the catalog checkout is migrated, orders tied to your accepted supplier agreements will appear here. You can view aggregate stats on your
          <a href="/vendor" className="text-[#3D5A3E] font-semibold hover:underline ml-1">dashboard</a>.
        </p>
      </motion.div>
    </div>
  )
}
