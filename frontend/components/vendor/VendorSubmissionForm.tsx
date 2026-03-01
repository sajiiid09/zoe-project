"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, FloppyDisk } from "@phosphor-icons/react"

import { apiUrl } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface SubmissionFormData {
  title: string
  description: string
  category: string
  vendorQuotedPrice: string
  suggestedRetailPrice: string
  stockAvailable: string
  images: string
}

interface VendorSubmissionFormProps {
  mode: "create" | "edit"
  submissionId?: string
  initialValues?: Partial<SubmissionFormData>
}

const createInitialState = (
  initialValues: Partial<SubmissionFormData> = {},
): SubmissionFormData => ({
  title: initialValues.title || "",
  description: initialValues.description || "",
  category: initialValues.category || "",
  vendorQuotedPrice: initialValues.vendorQuotedPrice || "",
  suggestedRetailPrice: initialValues.suggestedRetailPrice || "",
  stockAvailable: initialValues.stockAvailable || "0",
  images: initialValues.images || "",
})

export default function VendorSubmissionForm({
  mode,
  submissionId,
  initialValues,
}: VendorSubmissionFormProps) {
  const { token } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState(createInitialState(initialValues))
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!token) {
      router.replace("/login")
      return
    }

    setIsSaving(true)
    setError("")

    const payload = {
      title: form.title,
      description: form.description || undefined,
      category: form.category || undefined,
      vendorQuotedPrice: Number(form.vendorQuotedPrice),
      suggestedRetailPrice: form.suggestedRetailPrice
        ? Number(form.suggestedRetailPrice)
        : undefined,
      stockAvailable: Number(form.stockAvailable || 0),
      images: form.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }

    try {
      const endpoint =
        mode === "create"
          ? apiUrl("/vendor/submissions")
          : apiUrl(`/vendor/submissions/${submissionId}`)

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to save your submission")
        return
      }

      router.replace("/vendor/products")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Product title
          </label>
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="Hand-thrown ceramic vase"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Your quoted payout
          </label>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={form.vendorQuotedPrice}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                vendorQuotedPrice: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="45.00"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Suggested retail (optional)
          </label>
          <input
            min="0.01"
            step="0.01"
            type="number"
            value={form.suggestedRetailPrice}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                suggestedRetailPrice: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="65.00"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Category
          </label>
          <input
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="Decor"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Stock available
          </label>
          <input
            min="0"
            step="1"
            type="number"
            value={form.stockAvailable}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                stockAvailable: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Description
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="w-full resize-none rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder="Share finish, materials, craftsmanship notes, and sizing."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
            Image URLs
          </label>
          <textarea
            rows={4}
            value={form.images}
            onChange={(event) =>
              setForm((current) => ({ ...current, images: event.target.value }))
            }
            className="w-full resize-none rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm text-[#2C3B2D] outline-none transition focus:border-[#8AADA0]"
            placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
          />
          <p className="mt-2 text-xs text-[#7A826E]">
            Use one image URL per line. The first image is used as the preview thumbnail.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F5F2ED] px-5 py-4">
        <p className="max-w-xl text-sm text-[#4E6651]">
          Your quote is the supplier payout. Admin reviews the submission, sets the public sale
          price, and only the admin-owned catalog listing goes live.
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary disabled:pointer-events-none disabled:opacity-60"
        >
          {isSaving ? (
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              {mode === "create" ? (
                <>
                  Submit Offer <ArrowRight size={14} weight="bold" />
                </>
              ) : (
                <>
                  Save Changes <FloppyDisk size={14} weight="bold" />
                </>
              )}
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
}
