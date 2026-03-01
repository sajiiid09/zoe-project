"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FloppyDisk } from "@phosphor-icons/react"

import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface ProfileForm {
  displayName: string
  referralCode: string
  bio: string
  website: string
  payoutEmail: string
}

const emptyForm: ProfileForm = {
  displayName: "",
  referralCode: "",
  bio: "",
  website: "",
  payoutEmail: "",
}

export default function AffiliateProfilePage() {
  const { token, refreshUser } = useAuth()
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl("/affiliate/profile"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok && data.success) {
          setHasProfile(true)
          setForm({
            displayName: data.data.displayName || "",
            referralCode: data.data.referralCode || "",
            bio: data.data.bio || "",
            website: data.data.website || "",
            payoutEmail: data.data.payoutEmail || "",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!token) {
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch(apiUrl("/affiliate/profile"), {
        method: hasProfile ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to save profile")
        return
      }

      setHasProfile(true)
      setForm((current) => ({
        ...current,
        referralCode: data.data.referralCode || current.referralCode,
      }))
      setMessage(data.message || "Profile saved")
      await refreshUser()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
          Affiliate Setup
        </p>
        <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
          {hasProfile ? "Update Profile" : "Create Profile"}
        </h2>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
              Display Name
            </label>
            <input
              required
              value={form.displayName}
              onChange={(event) =>
                setForm((current) => ({ ...current, displayName: event.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
              placeholder="Curated Homes by Maya"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
              Referral Code
            </label>
            <input
              required
              disabled={hasProfile}
              value={form.referralCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, referralCode: event.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0] disabled:bg-[#F5F2ED] disabled:text-[#7A826E]"
              placeholder="maya-shares"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
              Bio
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              className="w-full resize-none rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
              placeholder="Tell the admin team where you promote and what audience you reach."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(event) =>
                setForm((current) => ({ ...current, website: event.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
              placeholder="https://your-site.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2C3B2D]">
              Payout Email
            </label>
            <input
              type="email"
              value={form.payoutEmail}
              onChange={(event) =>
                setForm((current) => ({ ...current, payoutEmail: event.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
              placeholder="payments@example.com"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F5F2ED] px-5 py-4">
          <p className="text-sm text-[#546255]">
            Admin approval is required before tracked referrals and commission reporting are turned
            on.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Save Profile <FloppyDisk size={14} weight="bold" />
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
