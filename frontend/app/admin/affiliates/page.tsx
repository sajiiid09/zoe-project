"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  MagnifyingGlass,
  UserSwitch,
  XCircle,
} from "@phosphor-icons/react"

import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface AffiliateProfile {
  id: string
  displayName: string
  referralCode: string
  approvalStatus: string
  rejectionNote: string | null
  payoutEmail: string | null
  user?: {
    email: string
    firstName: string | null
    lastName: string | null
  }
}

export default function AdminAffiliatesPage() {
  const { token } = useAuth()
  const [profiles, setProfiles] = useState<AffiliateProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<AffiliateProfile | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchProfiles = async () => {
      try {
        const response = await fetch(apiUrl("/users/admin/affiliates"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (data.success) {
          setProfiles(data.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [token])

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const fullName =
        `${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim()
      const haystack =
        `${profile.displayName} ${profile.referralCode} ${profile.user?.email || ""} ${fullName}`.toLowerCase()

      return haystack.includes(searchTerm.toLowerCase())
    })
  }, [profiles, searchTerm])

  const approveProfile = async (profileId: string) => {
    if (!token) {
      return
    }

    setActionLoading(profileId)

    try {
      const response = await fetch(apiUrl(`/users/admin/affiliates/${profileId}/approve`), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (data.success) {
        setProfiles((current) =>
          current.map((profile) =>
            profile.id === profileId
              ? { ...profile, approvalStatus: "APPROVED", rejectionNote: null }
              : profile,
          ),
        )
      }
    } finally {
      setActionLoading(null)
    }
  }

  const rejectProfile = async () => {
    if (!token || !rejectModal) {
      return
    }

    setActionLoading(rejectModal.id)

    try {
      const response = await fetch(apiUrl(`/users/admin/affiliates/${rejectModal.id}/reject`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      })
      const data = await response.json()

      if (data.success) {
        setProfiles((current) =>
          current.map((profile) =>
            profile.id === rejectModal.id
              ? {
                  ...profile,
                  approvalStatus: "REJECTED",
                  rejectionNote: rejectReason || null,
                }
              : profile,
          ),
        )
        setRejectModal(null)
        setRejectReason("")
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
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2E8] text-[#3D5A3E]">
          <UserSwitch size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
            Growth Channel
          </p>
          <h2 className="font-display text-4xl font-medium text-[#2C3B2D]">
            Affiliate Approvals
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F2ED] px-4 py-3">
          <MagnifyingGlass size={18} weight="duotone" className="text-[#5E7B60]" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search affiliates"
            className="w-full bg-transparent text-sm text-[#2C3B2D] outline-none placeholder:text-[#8C8E75]"
          />
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D3D6CA] bg-[#FCFBF8] px-6 py-14 text-center">
          <p className="text-lg font-medium text-[#2C3B2D]">No affiliate applications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProfiles.map((profile, index) => {
            const contactName =
              `${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim() ||
              profile.user?.email ||
              profile.displayName

            return (
              <motion.article
                key={profile.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#2C3B2D]">
                        {profile.displayName}
                      </h3>
                      <span className="rounded-full bg-[#F5F2ED] px-2.5 py-1 text-xs font-semibold text-[#526453]">
                        {profile.approvalStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#526453]">
                      <span>{contactName}</span>
                      <span>{profile.user?.email || "No email"}</span>
                      <span>Code: {profile.referralCode}</span>
                      <span>{profile.payoutEmail || "No payout email"}</span>
                    </div>
                    {profile.rejectionNote && (
                      <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {profile.rejectionNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {profile.approvalStatus !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => approveProfile(profile.id)}
                        disabled={actionLoading === profile.id}
                        className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle size={14} weight="fill" />
                          Approve
                        </span>
                      </button>
                    )}

                    {profile.approvalStatus !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => setRejectModal(profile)}
                        disabled={actionLoading === profile.id}
                        className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        <span className="inline-flex items-center gap-1">
                          <XCircle size={14} weight="fill" />
                          Reject
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {rejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModal(null)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#E8E3DA] bg-white p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-[#2C3B2D]">Reject Affiliate</h3>
              <p className="mt-2 text-sm text-[#546255]">{rejectModal.displayName}</p>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="mt-5 w-full resize-none rounded-xl border border-[#E8E3DA] px-4 py-3 text-sm outline-none transition focus:border-[#8AADA0]"
                placeholder="Optional reason for rejection"
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
                  onClick={rejectProfile}
                  disabled={actionLoading === rejectModal.id}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
