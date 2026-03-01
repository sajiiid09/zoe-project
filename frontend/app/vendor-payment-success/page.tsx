"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Storefront, ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, refreshUser } = useAuth()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId || !token) {
      setStatus("error")
      setErrorMsg("Missing payment session. Please try again.")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/payments/vendor-fee/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await res.json()

        if (data.success || data.message === "Already paid") {
          setStatus("success")
          await refreshUser()
        } else {
          setStatus("error")
          setErrorMsg(data.message || "Payment verification failed")
        }
      } catch {
        setStatus("error")
        setErrorMsg("Network error during verification")
      }
    }

    verify()
  }, [searchParams, token, refreshUser])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg bg-white border border-[#E8E3DA] rounded-2xl p-8 shadow-sm text-center"
    >
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 bg-[#8AADA0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <SpinnerGap size={32} weight="bold" className="text-[#8AADA0] animate-spin" />
          </div>
          <h1 className="font-display text-2xl font-medium text-[#2C3B2D] mb-2">Verifying Payment...</h1>
          <p className="text-[#6B7C5E] text-sm">Please wait while we confirm your payment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} weight="fill" className="text-green-500" />
          </motion.div>
          <h1 className="font-display text-3xl font-medium text-[#2C3B2D] mb-2">Payment Successful!</h1>
          <p className="text-[#6B7C5E] mb-6">
            Your vendor account is now active. You can set up your store and start selling.
          </p>

          <div className="bg-[#F5F2ED] rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Storefront size={24} weight="bold" className="text-[#3D5A3E]" />
              <span className="font-semibold text-[#3D5A3E]">What&apos;s next?</span>
            </div>
            <ul className="space-y-2 text-sm text-[#3D5A3E]">
              <li>1. Set up your store profile and branding</li>
              <li>2. Add your first products to the catalog</li>
              <li>3. Wait for admin approval, then you&apos;re live!</li>
            </ul>
          </div>

          <Link
            href="/vendor"
            className="btn-primary"
          >
            Go to Vendor Dashboard
            <ArrowRight size={18} weight="bold" />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2C3B2D] mb-2">Verification Failed</h1>
          <p className="text-red-500 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => router.push("/vendor-payment")}
            className="inline-flex items-center justify-center gap-2 bg-[#3D5A3E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2C3B2D] transition"
          >
            Try Again
          </button>
        </>
      )}
    </motion.div>
  )
}

export default function VendorPaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <Suspense
            fallback={
              <div className="w-8 h-8 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
            }
          >
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
