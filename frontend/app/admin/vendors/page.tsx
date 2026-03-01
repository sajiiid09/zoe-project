"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MagnifyingGlass, CheckCircle, XCircle, Clock, Storefront, CaretDown } from "@phosphor-icons/react"
import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface Vendor {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isActive: boolean
  createdAt: string
  store: {
    id: string
    name: string
    slug: string
    approvalStatus: string
    rejectionNote: string | null
    isActive: boolean
    createdAt: string
    _count: { products: number }
  } | null
}

export default function AdminVendorsPage() {
  const { token } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ storeId: string; vendorName: string } | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchVendors = async () => {
    try {
      const res = await fetch(apiUrl("/users/admin/vendors"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) setVendors(json.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchVendors()
  }, [token])

  const approveStore = async (storeId: string) => {
    setActionLoading(storeId)
    try {
      const res = await fetch(apiUrl(`/users/admin/vendors/${storeId}/approve`), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.success) {
        setVendors((prev) =>
          prev.map((v) =>
            v.store?.id === storeId
              ? { ...v, store: { ...v.store!, approvalStatus: "APPROVED", isActive: true, rejectionNote: null } }
              : v
          )
        )
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
    }
  }

  const rejectStore = async () => {
    if (!rejectModal) return
    setActionLoading(rejectModal.storeId)
    try {
      const res = await fetch(apiUrl(`/users/admin/vendors/${rejectModal.storeId}/reject`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      })
      const json = await res.json()
      if (json.success) {
        setVendors((prev) =>
          prev.map((v) =>
            v.store?.id === rejectModal.storeId
              ? { ...v, store: { ...v.store!, approvalStatus: "REJECTED", isActive: false, rejectionNote: rejectReason } }
              : v
          )
        )
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
      setRejectModal(null)
      setRejectReason("")
    }
  }

  const filtered = vendors.filter(
    (v) =>
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${v.firstName || ""} ${v.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.store?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex items-center gap-3">
        <Storefront size={32} weight="duotone" className="text-[#3D5A3E]" />
        <h1 className="text-3xl font-bold text-[#3D5A3E]">Vendor Management</h1>
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
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#3D5A3E] flex-1 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#6B7C5E]">
            <Storefront size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
            <p className="font-medium">No vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DA]">
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Vendor</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Store</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Products</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vendor, index) => (
                  <motion.tr
                    key={vendor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-[#E8E3DA] hover:bg-[#F5F2ED] transition"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#3D5A3E] text-sm">
                          {vendor.firstName || ""} {vendor.lastName || ""}
                        </p>
                        <p className="text-xs text-[#6B7C5E]">{vendor.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {vendor.store ? (
                        <span className="font-medium text-[#3D5A3E] text-sm">{vendor.store.name}</span>
                      ) : (
                        <span className="text-xs text-[#6B7C5E] italic">No store yet</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#3D5A3E] text-sm">
                      {vendor.store?._count?.products ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      {vendor.store ? statusBadge(vendor.store.approvalStatus) : (
                        <span className="text-xs text-[#6B7C5E]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6B7C5E] text-sm">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {vendor.store && (
                        <div className="flex items-center gap-2">
                          {vendor.store.approvalStatus !== "APPROVED" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => approveStore(vendor.store!.id)}
                              disabled={actionLoading === vendor.store.id}
                              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                            >
                              Approve
                            </motion.button>
                          )}
                          {vendor.store.approvalStatus !== "REJECTED" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setRejectModal({
                                  storeId: vendor.store!.id,
                                  vendorName: `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || vendor.email,
                                })
                              }
                              disabled={actionLoading === vendor.store.id}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                            >
                              Reject
                            </motion.button>
                          )}
                        </div>
                      )}
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
              <h3 className="text-lg font-bold text-[#3D5A3E] mb-2">Reject Store</h3>
              <p className="text-sm text-[#6B7C5E] mb-4">
                Rejecting store for <span className="font-semibold text-[#3D5A3E]">{rejectModal.vendorName}</span>
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
                  onClick={rejectStore}
                  disabled={actionLoading === rejectModal.storeId}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  Reject Store
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
