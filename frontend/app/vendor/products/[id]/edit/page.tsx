"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react"

import VendorSubmissionForm from "@/components/vendor/VendorSubmissionForm"
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
}

export default function EditVendorSubmissionPage() {
  const { token } = useAuth()
  const params = useParams()
  const submissionId = Array.isArray(params.id) ? params.id[0] : params.id
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !submissionId) {
      setLoading(false)
      return
    }

    const fetchSubmission = async () => {
      try {
        const response = await fetch(apiUrl(`/vendor/submissions/${submissionId}`), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (data.success) {
          setSubmission(data.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [submissionId, token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-9 w-9 rounded-full border-4 border-[#3D5A3E] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D3D6CA] bg-[#FCFBF8] px-6 py-14 text-center">
        <p className="text-lg font-medium text-[#2C3B2D]">Submission not found</p>
        <Link
          href="/vendor/products"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#4E6651] hover:text-[#2C3B2D]"
        >
          <CaretLeft size={14} weight="bold" />
          Back to submissions
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/vendor/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4E6651] transition hover:text-[#2C3B2D]"
      >
        <CaretLeft size={14} weight="bold" />
        Back to submissions
      </Link>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
          Edit
        </p>
        <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
          Update Supplier Offer
        </h2>
      </div>

      <VendorSubmissionForm
        mode="edit"
        submissionId={submission.id}
        initialValues={{
          title: submission.title,
          description: submission.description || "",
          category: submission.category || "",
          vendorQuotedPrice: String(submission.vendorQuotedPrice),
          suggestedRetailPrice: submission.suggestedRetailPrice
            ? String(submission.suggestedRetailPrice)
            : "",
          stockAvailable: String(submission.stockAvailable),
          images: submission.images.join("\n"),
        }}
      />
    </div>
  )
}
