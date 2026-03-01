"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Storefront, FloppyDisk } from "@phosphor-icons/react"
import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface StoreData {
  id?: string
  name: string
  description: string
  logo: string
  banner: string
  address: string
  phone: string
  email: string
  approvalStatus?: string
  rejectionNote?: string
}

export default function VendorStorePage() {
  const { token } = useAuth()
  const [hasStore, setHasStore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const [form, setForm] = useState<StoreData>({
    name: "",
    description: "",
    logo: "",
    banner: "",
    address: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(apiUrl("/vendor/store"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success && json.data) {
          setHasStore(true)
          setForm({
            id: json.data.id,
            name: json.data.name || "",
            description: json.data.description || "",
            logo: json.data.logo || "",
            banner: json.data.banner || "",
            address: json.data.address || "",
            phone: json.data.phone || "",
            email: json.data.email || "",
            approvalStatus: json.data.approvalStatus,
            rejectionNote: json.data.rejectionNote,
          })
        }
      } catch {
        // no store yet
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchStore()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const url = apiUrl("/vendor/store")
      const method = hasStore ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (json.success) {
        setHasStore(true)
        setMessage(json.message || "Store saved successfully")
        setMessageType("success")
        if (json.data) {
          setForm((prev) => ({ ...prev, id: json.data.id, approvalStatus: json.data.approvalStatus }))
        }
      } else {
        setMessage(json.message || "Failed to save store")
        setMessageType("error")
      }
    } catch {
      setMessage("Network error")
      setMessageType("error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Storefront size={32} weight="duotone" className="text-[#3D5A3E]" />
        <h1 className="text-3xl font-bold text-[#3D5A3E]">{hasStore ? "Edit Store" : "Create Your Store"}</h1>
      </div>

      {form.approvalStatus === "REJECTED" && form.rejectionNote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
        >
          <p className="font-semibold mb-1">Your store was rejected</p>
          <p className="text-sm">{form.rejectionNote}</p>
        </motion.div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-sm font-medium ${
            messageType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA] space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Store Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
            placeholder="My Awesome Store"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm resize-none"
            placeholder="Tell customers about your store..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Logo URL</label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Banner URL</label>
            <input
              type="url"
              value={form.banner}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
            placeholder="123 Main St, City"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
              placeholder="+1-555-0123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C3B2D] mb-1.5">Contact Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AADA0] text-[#2C3B2D] text-sm"
              placeholder="store@example.com"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#3D5A3E] text-white py-3 rounded-lg font-semibold hover:bg-[#2C3B2D] transition disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FloppyDisk size={18} weight="bold" />
              {hasStore ? "Update Store" : "Create Store"}
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  )
}
