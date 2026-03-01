"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Storefront, ShieldCheck } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function VendorPaymentPage() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // If already paid, redirect to vendor dashboard
  if (user?.vendorFeePaid) {
    router.push("/vendor")
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
      const res = await fetch(`${API_URL}/payments/vendor-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success && data.data?.url) {
        window.location.href = data.data.url
      } else {
        setError(data.message || "Failed to create payment session")
      }
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
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-white border border-[#E8E3DA] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#3D5A3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Storefront size={32} weight="bold" className="text-[#3D5A3E]" />
              </div>
              <h1 className="font-display text-3xl font-medium text-[#2C3B2D] mb-2">Vendor Registration Fee</h1>
              <p className="text-[#6B7C5E] text-sm">
                A one-time fee is required to activate your vendor account
              </p>
            </div>

            <div className="bg-[#F5F2ED] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#3D5A3E] font-medium">Vendor Registration Fee</span>
                <span className="text-2xl font-bold text-[#2C3B2D]">$10.00</span>
              </div>
              <div className="border-t border-[#E8E3DA] pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  <span>Create and manage your own store</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  <span>List unlimited products on the marketplace</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  <span>Access vendor dashboard &amp; analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                  <ShieldCheck size={16} weight="bold" className="text-[#8AADA0]" />
                  <span>One-time payment — no recurring charges</span>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isLoading || !isAuthenticated}
              className="w-full btn-primary justify-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={20} weight="bold" />
                  Pay $10.00 &amp; Activate Account
                </>
              )}
            </motion.button>

            <p className="mt-4 text-center text-xs text-[#6B7C5E]">
              Secure payment powered by Stripe. Your card details are never stored on our servers.
            </p>

            {!isAuthenticated && (
              <p className="mt-4 text-center text-sm text-red-500">
                Please{" "}
                <a href="/login" className="underline font-semibold">
                  sign in
                </a>{" "}
                first to complete payment.
              </p>
            )}
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
