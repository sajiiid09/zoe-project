"use client"

import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react"

import VendorSubmissionForm from "@/components/vendor/VendorSubmissionForm"

export default function AddVendorSubmissionPage() {
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
          Create
        </p>
        <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
          New Supplier Offer
        </h2>
      </div>

      <VendorSubmissionForm mode="create" />
    </div>
  )
}
