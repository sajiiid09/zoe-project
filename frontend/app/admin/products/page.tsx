"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  Clock,
  CurrencyCircleDollar,
  Package,
  XCircle,
} from "@phosphor-icons/react"

import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface Submission {
  id: string
  title: string
  category: string | null
  images: string[]
  vendorQuotedPrice: number
  suggestedRetailPrice: number | null
  stockAvailable: number
  status: string
  vendor: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  store: {
    name: string
  }
}

interface CatalogProduct {
  id: string
  title: string
  category: string | null
  images: string[]
  retailPrice: number
  stock: number
  status: string
  sourceSubmission: {
    id: string
    title: string
    vendorId: string
  } | null
}

type TabKey = "submissions" | "catalog"

const reviewableStates = new Set(["SUBMITTED", "UNDER_REVIEW"])

export default function AdminProductsPage() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>("submissions")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [acceptModal, setAcceptModal] = useState<{
    submissionId: string
    title: string
    retailPrice: string
  } | null>(null)
  const [rejectModal, setRejectModal] = useState<{
    submissionId: string
    title: string
  } | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [submissionsResponse, catalogResponse] = await Promise.all([
          fetch(apiUrl("/admin/submissions"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(apiUrl("/admin/catalog"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const [submissionsData, catalogData] = await Promise.all([
          submissionsResponse.json(),
          catalogResponse.json(),
        ])

        if (submissionsData.success) {
          setSubmissions(submissionsData.data)
        }

        if (catalogData.success) {
          setCatalogProducts(catalogData.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const currentItems = useMemo(() => {
    const items = activeTab === "submissions" ? submissions : catalogProducts

    return items.filter((item) => {
      const title = item.title.toLowerCase()
      const category = (item.category || "").toLowerCase()
      return (
        title.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase())
      )
    })
  }, [activeTab, catalogProducts, searchTerm, submissions])

  const openAcceptModal = (submission: Submission) => {
    const fallbackRetail =
      submission.suggestedRetailPrice ||
      Number((submission.vendorQuotedPrice * 1.35).toFixed(2))

    setAcceptModal({
      submissionId: submission.id,
      title: submission.title,
      retailPrice: String(fallbackRetail),
    })
  }

  const acceptSubmission = async () => {
    if (!token || !acceptModal) {
      return
    }

    setActionLoading(acceptModal.submissionId)

    try {
      const response = await fetch(
        apiUrl(`/admin/submissions/${acceptModal.submissionId}/accept`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            retailPrice: Number(acceptModal.retailPrice),
            status: "ACTIVE",
          }),
        },
      )
      const data = await response.json()

      if (data.success) {
        setSubmissions((current) =>
          current.map((submission) =>
            submission.id === acceptModal.submissionId
              ? { ...submission, status: "ACCEPTED" }
              : submission,
          ),
        )
        setCatalogProducts((current) => [data.data.catalogProduct, ...current])
        setAcceptModal(null)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const rejectSubmission = async () => {
    if (!token || !rejectModal) {
      return
    }

    setActionLoading(rejectModal.submissionId)

    try {
      const response = await fetch(
        apiUrl(`/admin/submissions/${rejectModal.submissionId}/reject`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        },
      )
      const data = await response.json()

      if (data.success) {
        setSubmissions((current) =>
          current.map((submission) =>
            submission.id === rejectModal.submissionId
              ? { ...submission, status: "REJECTED" }
              : submission,
          ),
        )
        setRejectModal(null)
        setRejectReason("")
      }
    } finally {
      setActionLoading(null)
    }
  }

  const updateCatalogStatus = async (productId: string, status: string) => {
    if (!token) {
      return
    }

    setActionLoading(productId)

    try {
      const response = await fetch(apiUrl(`/admin/catalog/${productId}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()

      if (data.success) {
        setCatalogProducts((current) =>
          current.map((item) =>
            item.id === productId ? { ...item, status: data.data.status } : item,
          ),
        )
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-9 w-9 rounded-full border-4 border-[#3D5A3E] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
            Marketplace Controls
          </p>
          <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
            Supplier Review &amp; Catalog
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeTab === "submissions"
              ? "bg-[#3D5A3E] text-white"
              : "bg-white text-[#526453] hover:text-[#2C3B2D]"
          }`}
        >
          Submissions ({submissions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeTab === "catalog"
              ? "bg-[#3D5A3E] text-white"
              : "bg-white text-[#526453] hover:text-[#2C3B2D]"
          }`}
        >
          Catalog ({catalogProducts.length})
        </button>
      </div>

      <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={
            activeTab === "submissions"
              ? "Search supplier submissions"
              : "Search catalog products"
          }
          className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
        />
      </div>

      {currentItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D3D6CA] bg-[#FCFBF8] px-6 py-14 text-center">
          <p className="text-lg font-medium text-[#2C3B2D]">Nothing to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "submissions" &&
            (currentItems as Submission[]).map((submission, index) => {
              const vendorName =
                `${submission.vendor.firstName || ""} ${submission.vendor.lastName || ""}`.trim() ||
                submission.vendor.email

              return (
                <motion.article
                  key={submission.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#F5F2ED]">
                        <Image
                          src={submission.images[0] || "/placeholder.svg"}
                          alt={submission.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-[#2C3B2D]">
                            {submission.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F2ED] px-2.5 py-1 text-xs font-semibold text-[#526453]">
                            <Clock size={14} weight="fill" />
                            {submission.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-[#526453]">
                          <span>Supplier: {vendorName}</span>
                          <span>Store: {submission.store?.name || "No store"}</span>
                          <span>Quote: ${submission.vendorQuotedPrice.toFixed(2)}</span>
                          <span>
                            Suggested: $
                            {submission.suggestedRetailPrice?.toFixed(2) || "Not set"}
                          </span>
                          <span>Stock: {submission.stockAvailable}</span>
                        </div>
                      </div>
                    </div>

                    {reviewableStates.has(submission.status) && (
                      <div className="flex items-center gap-2 self-start">
                        <button
                          type="button"
                          onClick={() => openAcceptModal(submission)}
                          className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRejectModal({
                              submissionId: submission.id,
                              title: submission.title,
                            })
                          }
                          className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.article>
              )
            })}

          {activeTab === "catalog" &&
            (currentItems as CatalogProduct[]).map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#F5F2ED]">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#2C3B2D]">
                          {product.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F2ED] px-2.5 py-1 text-xs font-semibold text-[#526453]">
                          <Package size={14} weight="fill" />
                          {product.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#526453]">
                        <span className="inline-flex items-center gap-1">
                          <CurrencyCircleDollar size={14} weight="fill" />
                          {Number(product.retailPrice).toFixed(2)}
                        </span>
                        <span>Stock: {product.stock}</span>
                        <span>{product.category || "Uncategorized"}</span>
                        {product.sourceSubmission && (
                          <span>Source: {product.sourceSubmission.title}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <select
                    value={product.status}
                    disabled={actionLoading === product.id}
                    onChange={(event) =>
                      updateCatalogStatus(product.id, event.target.value)
                    }
                    className="self-start rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>
              </motion.article>
            ))}
        </div>
      )}

      <AnimatePresence>
        {acceptModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setAcceptModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#E8E3DA] bg-white p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-[#2C3B2D]">Accept Submission</h3>
              <p className="mt-2 text-sm text-[#546255]">{acceptModal.title}</p>
              <label className="mt-5 block text-sm font-medium text-[#2C3B2D]">
                Retail price
              </label>
              <input
                min="0.01"
                step="0.01"
                type="number"
                value={acceptModal.retailPrice}
                onChange={(event) =>
                  setAcceptModal((current) =>
                    current
                      ? { ...current, retailPrice: event.target.value }
                      : current,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAcceptModal(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#526453] transition hover:bg-[#F5F2ED]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={acceptSubmission}
                  disabled={actionLoading === acceptModal.submissionId}
                  className="rounded-xl bg-[#3D5A3E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2C3B2D] disabled:opacity-50"
                >
                  Confirm &amp; Publish
                </button>
              </div>
            </motion.div>
          </>
        )}

        {rejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setRejectModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#E8E3DA] bg-white p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-[#2C3B2D]">Reject Submission</h3>
              <p className="mt-2 text-sm text-[#546255]">{rejectModal.title}</p>
              <label className="mt-5 block text-sm font-medium text-[#2C3B2D]">
                Reason
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
                placeholder="Explain why this submission cannot be accepted."
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#526453] transition hover:bg-[#F5F2ED]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={rejectSubmission}
                  disabled={actionLoading === rejectModal.submissionId}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
