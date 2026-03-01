"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, LinkSimple, ShieldCheck } from "@phosphor-icons/react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

export default function AffiliatePaymentPage() {
  const { token, user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.affiliateFeePaid) {
      router.replace("/affiliate")
    }
  }, [router, user?.affiliateFeePaid])

  if (user?.affiliateFeePaid) {
    return null
  }

  const handlePayment = async () => {
    if (!token) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(apiUrl("/payments/affiliate-fee"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success && data.data?.url) {
        window.location.href = data.data.url
        return
      }

      setError(data.message || "Failed to create payment session")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg rounded-3xl border border-[#E8E3DA] bg-white p-8 shadow-sm"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3D5A3E]/10">
                <LinkSimple size={32} weight="bold" className="text-[#3D5A3E]" />
              </div>
              <h1 className="font-display text-3xl font-medium text-[#2C3B2D]">
                Affiliate Access Fee
              </h1>
              <p className="mt-2 text-sm text-[#6B7C5E]">
                A one-time activation fee unlocks your affiliate profile and approval review.
              </p>
            </div>

            <div className="mb-6 rounded-2xl bg-[#F5F2ED] p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-medium text-[#3D5A3E]">Affiliate registration fee</span>
                <span className="text-2xl font-bold text-[#2C3B2D]">$10.00</span>
              </div>

              <div className="space-y-2 border-t border-[#E8E3DA] pt-4">
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  Create and submit your affiliate profile
                </div>
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  Get approved for tracked referral links
                </div>
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  One-time payment, no recurring platform fee
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={isLoading || !isAuthenticated}
              className="btn-primary w-full justify-center disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <CreditCard size={18} weight="bold" />
                  Pay $10.00 &amp; Continue
                </>
              )}
            </button>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
