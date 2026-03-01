"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  LinkSimple,
  SpinnerGap,
} from "@phosphor-icons/react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"
import { apiUrl } from "@/lib/api"

function AffiliatePaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, refreshUser } = useAuth()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId || !token) {
      setStatus("error")
      setErrorMessage("Missing payment session. Please try again.")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(apiUrl("/payments/affiliate-fee/verify"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        })
        const data = await response.json()

        if (data.success || data.message === "Already paid") {
          setStatus("success")
          await refreshUser()
          return
        }

        setStatus("error")
        setErrorMessage(data.message || "Payment verification failed")
      } catch {
        setStatus("error")
        setErrorMessage("Network error during verification")
      }
    }

    verifyPayment()
  }, [refreshUser, searchParams, token])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg rounded-3xl border border-[#E8E3DA] bg-white p-8 text-center shadow-sm"
    >
      {status === "verifying" && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8AADA0]/10">
            <SpinnerGap size={32} weight="bold" className="animate-spin text-[#8AADA0]" />
          </div>
          <h1 className="font-display text-2xl font-medium text-[#2C3B2D]">
            Verifying Payment
          </h1>
          <p className="mt-2 text-sm text-[#6B7C5E]">
            Please wait while we activate your affiliate access.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle size={46} weight="fill" className="text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl font-medium text-[#2C3B2D]">
            You&apos;re ready to onboard
          </h1>
          <p className="mt-3 text-sm text-[#6B7C5E]">
            Your affiliate fee is confirmed. Create your profile next so the admin team can review
            and approve your account.
          </p>

          <div className="mt-6 rounded-2xl bg-[#F5F2ED] p-6 text-left">
            <div className="mb-3 flex items-center gap-3">
              <LinkSimple size={22} weight="bold" className="text-[#3D5A3E]" />
              <span className="font-semibold text-[#3D5A3E]">What happens next</span>
            </div>
            <ul className="space-y-2 text-sm text-[#3D5A3E]">
              <li>1. Create your affiliate profile</li>
              <li>2. Wait for admin approval</li>
              <li>3. Start sharing tracked product links</li>
            </ul>
          </div>

          <Link href="/affiliate" className="mt-6 inline-flex btn-primary">
            Go to Affiliate Studio
            <ArrowRight size={16} weight="bold" />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl font-bold text-rose-500">
            !
          </div>
          <h1 className="text-2xl font-bold text-[#2C3B2D]">Verification Failed</h1>
          <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => router.push("/affiliate-payment")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3D5A3E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C3B2D]"
          >
            Try Again
          </button>
        </>
      )}
    </motion.div>
  )
}

export default function AffiliatePaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <Suspense
            fallback={
              <div className="h-8 w-8 rounded-full border-4 border-[#3D5A3E] border-t-transparent animate-spin" />
            }
          >
            <AffiliatePaymentSuccessContent />
          </Suspense>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
