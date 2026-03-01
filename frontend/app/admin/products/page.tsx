"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Plus, PencilSimple, Trash, MagnifyingGlass, CheckCircle, XCircle, Clock, Storefront } from "@phosphor-icons/react"
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
  store?: {
    id: string
    name: string
    slug: string
    logo: string | null
    owner?: { id: string; email: string; firstName: string; lastName: string }
  } | null
}

type Tab = "all" | "pending"

export default function AdminProductsPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<Tab>("all")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ productId: string; productName: string } | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      if (json.success) setAllProducts(json.data)
    } catch {
      // ignore
    }
  }

  const fetchPendingProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) setPendingProducts(json.data)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!token) return
    Promise.all([fetchAllProducts(), fetchPendingProducts()]).finally(() => setLoading(false))
  }, [token])

  const approveProduct = async (id: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`${API_URL}/products/admin/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) {
        setPendingProducts((prev) => prev.filter((p) => p.id !== id))
        fetchAllProducts()
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
    }
  }

  const rejectProduct = async () => {
    if (!rejectModal) return
    setActionLoading(rejectModal.productId)
    try {
      const res = await fetch(`${API_URL}/products/admin/${rejectModal.productId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      })
      const json = await res.json()
      if (json.success) {
        setPendingProducts((prev) => prev.filter((p) => p.id !== rejectModal.productId))
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
      setRejectModal(null)
      setRejectReason("")
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    setActionLoading(id)
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) {
        setAllProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
    }
  }

  const currentProducts = tab === "pending" ? pendingProducts : allProducts
  const filtered = currentProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const statusBadge = (status: string) => {
    const config: Record<string, { bg: string; icon: React.ReactNode }> = {
      PENDING: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} weight="fill" /> },
      APPROVED: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={14} weight="fill" /> },
      REJECTED: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} weight="fill" /> },
    }
    const c = config[status] || config.PENDING
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg}`}>
        {c.icon} {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#3D5A3E]">Products Management</h1>
        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 bg-[#3D5A3E] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2C3B2D] transition"
        >
          <Plus size={20} weight="bold" /> Add Product
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F2ED] p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "all" ? "bg-white text-[#3D5A3E] shadow-sm" : "text-[#6B7C5E] hover:text-[#3D5A3E]"
          }`}
        >
          All Products ({allProducts.length})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "pending" ? "bg-white text-[#3D5A3E] shadow-sm" : "text-[#6B7C5E] hover:text-[#3D5A3E]"
          }`}
        >
          Pending Approval
          {pendingProducts.length > 0 && (
            <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">
              {pendingProducts.length}
            </span>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
      >
        <div className="mb-6 flex items-center gap-2 bg-[#F5F2ED] px-4 py-2 rounded-lg">
          <MagnifyingGlass size={20} weight="bold" className="text-[#6B7C5E]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#3D5A3E] flex-1 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#6B7C5E]">
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DA]">
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Price</th>
                  {tab === "pending" && (
                    <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Vendor</th>
                  )}
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-[#E8E3DA] hover:bg-[#F5F2ED] transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-[#E8E3DA]"
                        />
                        <div>
                          <span className="font-semibold text-[#3D5A3E] text-sm">{product.name}</span>
                          {product.category && <p className="text-xs text-[#6B7C5E]">{product.category}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#3D5A3E] font-medium text-sm">${Number(product.price).toFixed(2)}</td>
                    {tab === "pending" && (
                      <td className="py-3 px-4">
                        {product.store ? (
                          <div className="flex items-center gap-2">
                            <Storefront size={14} className="text-[#8AADA0]" />
                            <span className="text-sm text-[#3D5A3E]">{product.store.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#6B7C5E]">Admin</span>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">{statusBadge(product.approvalStatus)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {tab === "pending" ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => approveProduct(product.id)}
                              disabled={actionLoading === product.id}
                              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setRejectModal({ productId: product.id, productName: product.name })
                              }
                              disabled={actionLoading === product.id}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                            >
                              Reject
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-[#8AADA0] hover:bg-[#F5F2ED] rounded transition"
                            >
                              <PencilSimple size={18} weight="bold" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteProduct(product.id)}
                              disabled={actionLoading === product.id}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                            >
                              <Trash size={18} weight="bold" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModal(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-xl border border-[#E8E3DA]"
            >
              <h3 className="text-lg font-bold text-[#3D5A3E] mb-2">Reject Product</h3>
              <p className="text-sm text-[#6B7C5E] mb-4">
                Rejecting <span className="font-semibold text-[#3D5A3E]">{rejectModal.productName}</span>
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-[#2C3B2D] text-sm resize-none mb-4"
                placeholder="Reason for rejection (optional)..."
              />
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setRejectModal(null)}
                  className="px-4 py-2 text-[#3D5A3E] hover:bg-[#F5F2ED] rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={rejectProduct}
                  disabled={actionLoading === rejectModal.productId}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  Reject Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
