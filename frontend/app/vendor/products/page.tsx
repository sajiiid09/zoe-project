"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, PencilSimple, Trash, MagnifyingGlass, Clock, CheckCircle, XCircle } from "@phosphor-icons/react"
import { useAuth } from "@/context/AuthContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string | null
  images: string[]
  approvalStatus: string
  rejectionNote: string | null
  createdAt: string
}

export default function VendorProductsPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`${API_URL}/vendor/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) setProducts(json.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchProducts()
  }, [token, statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    setDeleting(id)
    try {
      const res = await fetch(`${API_URL}/vendor/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null)
    }
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const statusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={16} weight="fill" className="text-green-600" />
      case "REJECTED":
        return <XCircle size={16} weight="fill" className="text-red-600" />
      default:
        return <Clock size={16} weight="fill" className="text-yellow-600" />
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-700"}`}>
        {statusIcon(status)} {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#546A50] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#546A50]">My Products</h1>
        <Link
          href="/vendor/products/add"
          className="flex items-center gap-2 bg-[#546A50] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3F4E40] transition"
        >
          <Plus size={20} weight="bold" /> Add Product
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E0D8]"
      >
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-[#F5F3F0] px-4 py-2 rounded-lg">
            <MagnifyingGlass size={20} weight="bold" className="text-[#B5B89B]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-[#546A50] flex-1 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#E5E0D8] rounded-lg text-[#546A50] text-sm focus:outline-none focus:ring-2 focus:ring-[#7EBAAD]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#B5B89B]">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E0D8]">
                  <th className="text-left py-3 px-4 font-semibold text-[#546A50] text-sm">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#546A50] text-sm">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#546A50] text-sm">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#546A50] text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#546A50] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-[#E5E0D8] hover:bg-[#F5F3F0] transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-[#E5E0D8]"
                        />
                        <div>
                          <span className="font-semibold text-[#546A50] text-sm">{product.name}</span>
                          {product.category && (
                            <p className="text-xs text-[#B5B89B]">{product.category}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#546A50] font-medium text-sm">${Number(product.price).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {statusBadge(product.approvalStatus)}
                      {product.rejectionNote && (
                        <p className="text-xs text-red-500 mt-1">{product.rejectionNote}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/vendor/products/${product.id}/edit`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-[#7EBAAD] hover:bg-[#F5F3F0] rounded transition"
                          >
                            <PencilSimple size={18} weight="bold" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                        >
                          <Trash size={18} weight="bold" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
