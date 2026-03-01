"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
  XCircle,
} from "@phosphor-icons/react"

import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface Submission {
  id: string
  title: string
  description: string | null
  category: string | null
  vendorQuotedPrice: number
  suggestedRetailPrice: number | null
  stockAvailable: number
  images: string[]
  status: string
  rejectionReason: string | null
  createdAt: string
  catalogProduct?: {
    id: string
    retailPrice: number
    status: string
  } | null
}

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-800",
  UNDER_REVIEW: "bg-sky-100 text-sky-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  DRAFT: "bg-stone-100 text-stone-700",
}

const getStatusIcon = (status: string) => {
  if (status === "ACCEPTED") {
    return <CheckCircle size={14} weight="fill" />
  }

  if (status === "REJECTED") {
    return <XCircle size={14} weight="fill" />
  }

  return <Clock size={14} weight="fill" />
}

export default function VendorProductsPage() {
  const { token } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(apiUrl("/vendor/submissions"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (data.success) {
          setSubmissions(data.data)
        }
      } catch {
        // keep the current empty state
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [token])

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesStatus = statusFilter ? submission.status === statusFilter : true
      const haystack = `${submission.title} ${submission.category || ""}`.toLowerCase()
      const matchesSearch = haystack.includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [searchTerm, statusFilter, submissions])

  const deleteSubmission = async (submissionId: string) => {
    if (!token || !window.confirm("Delete this submission?")) {
      return
    }

    setDeletingId(submissionId)

    try {
      const response = await fetch(apiUrl(`/vendor/submissions/${submissionId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (data.success) {
        setSubmissions((current) =>
          current.filter((submission) => submission.id !== submissionId),
        )
      }
    } finally {
      setDeletingId(null)
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
            Supplier Flow
          </p>
          <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
            Product Submissions
          </h2>
        </div>

        <Link href="/vendor/products/add" className="btn-primary">
          <Plus size={16} weight="bold" />
          New Submission
        </Link>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F2ED] px-4 py-3">
          <MagnifyingGlass size={18} weight="duotone" className="text-[#5E7B60]" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title or category"
            className="w-full bg-transparent text-sm text-[#2C3B2D] outline-none placeholder:text-[#8C8E75]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none"
        >
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D3D6CA] bg-[#FCFBF8] px-6 py-14 text-center">
          <p className="text-lg font-medium text-[#2C3B2D]">No submissions yet</p>
          <p className="mt-2 text-sm text-[#6C7963]">
            Submit supplier offers here. Approved offers are converted into admin-owned catalog
            products.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission, index) => {
            const isMutable = submission.status === "SUBMITTED" || submission.status === "DRAFT"

            return (
              <motion.article
                key={submission.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
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
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[submission.status] || "bg-stone-100 text-stone-700"}`}
                        >
                          {getStatusIcon(submission.status)}
                          {submission.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#526453]">
                        <span>Quote: ${submission.vendorQuotedPrice.toFixed(2)}</span>
                        <span>
                          Suggested: $
                          {submission.suggestedRetailPrice?.toFixed(2) || "Not set"}
                        </span>
                        <span>Stock: {submission.stockAvailable}</span>
                        <span>{submission.category || "Uncategorized"}</span>
                      </div>

                      {submission.catalogProduct && (
                        <p className="text-sm text-[#3D5A3E]">
                          Published by admin at $
                          {Number(submission.catalogProduct.retailPrice).toFixed(2)} in the
                          catalog.
                        </p>
                      )}

                      {submission.rejectionReason && (
                        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                          {submission.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {isMutable && (
                      <Link
                        href={`/vendor/products/${submission.id}/edit`}
                        className="rounded-xl border border-[#DDE4D7] p-3 text-[#456047] transition hover:border-[#3D5A3E] hover:bg-[#F5F8F3]"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </Link>
                    )}

                    {isMutable && (
                      <button
                        type="button"
                        onClick={() => deleteSubmission(submission.id)}
                        disabled={deletingId === submission.id}
                        className="rounded-xl border border-rose-200 p-3 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </div>
  )
}
