"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, FloppyDisk, ArrowLeft } from "@phosphor-icons/react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function AddProductPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name || !form.price) {
      setError("Product name and price are required")
      return
    }

    setSaving(true)

    try {
      const images = form.images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)

      const res = await fetch(`${API_URL}/vendor/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          category: form.category || undefined,
          price: parseFloat(form.price),
          stock: parseInt(form.stock) || 0,
          images,
        }),
      })

      const json = await res.json()

      if (json.success) {
        router.push("/vendor/products")
      } else {
        setError(json.message || "Failed to create product")
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vendor/products" className="p-2 hover:bg-[#F5F3F0] rounded transition text-[#546A50]">
          <ArrowLeft size={20} weight="bold" />
        </Link>
        <Package size={32} weight="duotone" className="text-[#546A50]" />
        <h1 className="text-3xl font-bold text-[#546A50]">Add Product</h1>
      </div>

      <p className="text-sm text-[#B5B89B]">
        Your product will be submitted for admin approval before appearing in the marketplace.
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E0D8] space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Product Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm"
            placeholder="Ceramic Vase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm resize-none"
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm"
            placeholder="Vases, Candles, Furniture..."
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm"
              placeholder="29.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Image URLs (one per line)</label>
          <textarea
            rows={3}
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] text-sm resize-none font-mono"
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#546A50] text-white py-3 rounded-lg font-semibold hover:bg-[#3F4E40] transition disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FloppyDisk size={18} weight="bold" /> Submit for Approval
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  )
}
