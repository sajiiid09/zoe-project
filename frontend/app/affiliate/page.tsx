"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react"

import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

interface AffiliateProfile {
  id: string
  displayName: string
  referralCode: string
  approvalStatus: string
  rejectionNote: string | null
  commissionRate?: number
  payoutEmail?: string | null
}

export default function AffiliateDashboardPage() {
  const { token, user } = useAuth()
  const [profile, setProfile] = useState<AffiliateProfile | null>(
    user?.affiliateProfile || null,
  )
  const [loading, setLoading] = useState(!user?.affiliateProfile)

  useEffect(() => {
    if (!token || user?.affiliateProfile) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl("/affiliate/profile"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (data.success) {
          setProfile(data.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, user?.affiliateProfile])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-9 w-9 rounded-full border-4 border-[#3D5A3E] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-[#E8E3DA] bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
            Onboarding
          </p>
          <h2 className="mt-2 font-display text-4xl font-medium text-[#2C3B2D]">
            Complete your affiliate profile
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#546255]">
            You have paid the affiliate access fee. The next step is setting your public profile,
            payout email, and referral code so the admin team can review and activate you.
          </p>
          <Link href="/affiliate/profile" className="mt-6 inline-flex btn-primary">
            Set Up Profile
            <Sparkle size={16} weight="bold" />
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig: Record<string, { tone: string; icon: React.ReactNode; copy: string }> = {
    APPROVED: {
      tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle size={18} weight="fill" />,
      copy: "Your affiliate profile is approved. Referral links will unlock as the next backend slice goes live.",
    },
    REJECTED: {
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <WarningCircle size={18} weight="fill" />,
      copy: profile.rejectionNote || "Your profile was rejected. Update the details and resubmit.",
    },
    PENDING: {
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={18} weight="fill" />,
      copy: "Your profile is waiting for admin approval. You will be able to share tracked links after approval.",
    },
  }

  const status = statusConfig[profile.approvalStatus] || statusConfig.PENDING

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border px-5 py-4 ${status.tone}`}>
        <div className="flex items-start gap-3">
          {status.icon}
          <div>
            <p className="text-sm font-semibold">{profile.approvalStatus}</p>
            <p className="mt-1 text-sm">{status.copy}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8E75]">
            Profile
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium text-[#2C3B2D]">
            {profile.displayName}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F5F2ED] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7A826E]">
                Referral Code
              </p>
              <p className="mt-2 text-xl font-semibold text-[#2C3B2D]">
                {profile.referralCode}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F5F2ED] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7A826E]">
                Commission Rate
              </p>
              <p className="mt-2 text-xl font-semibold text-[#2C3B2D]">
                {profile.commissionRate ?? 5}%
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#FCFBF8] p-5">
            <p className="text-sm text-[#526453]">
              This slice only covers profile onboarding. Link generation, click tracking, and
              commission views will connect in the next affiliate implementation phase.
            </p>
          </div>
        </div>

        <div id="sharing" className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2E8] text-[#3D5A3E]">
            <LinkIcon size={22} weight="duotone" />
          </div>
          <h3 className="text-xl font-semibold text-[#2C3B2D]">Sharing will live here</h3>
          <p className="mt-3 text-sm leading-7 text-[#546255]">
            Once tracked links are enabled, this panel will show approved campaign assets, copy
            snippets, and link performance.
          </p>
          <Link
            href="/affiliate/profile"
            className="mt-5 inline-flex text-sm font-semibold text-[#3D5A3E] hover:text-[#2C3B2D]"
          >
            Update profile details
          </Link>
        </div>
      </div>
    </div>
  )
}
