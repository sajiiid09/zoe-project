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
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      <PageTransition>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#546A50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Storefront size={32} weight="bold" className="text-[#546A50]" />
              </div>
              <h1 className="text-3xl font-bold text-[#3F4E40] mb-2">Vendor Registration Fee</h1>
              <p className="text-[#B5B89B] text-sm">
                A one-time fee is required to activate your vendor account
              </p>
            </div>

            <div className="bg-[#F5F3F0] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#546A50] font-medium">Vendor Registration Fee</span>
                <span className="text-2xl font-bold text-[#3F4E40]">$10.00</span>
              </div>
              <div className="border-t border-[#E5E0D8] pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#546A50]">
                  <ShieldCheck size={16} weight="bold" className="text-[#7EBAAD]" />
                  <span>Create and manage your own store</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#546A50]">
                  <ShieldCheck size={16} weight="bold" className="text-[#7EBAAD]" />
                  <span>List unlimited products on the marketplace</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#546A50]">
                  <ShieldCheck size={16} weight="bold" className="text-[#7EBAAD]" />
                  <span>Access vendor dashboard &amp; analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#546A50]">
                  <ShieldCheck size={16} weight="bold" className="text-[#7EBAAD]" />
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
              className="w-full flex items-center justify-center gap-2 bg-[#546A50] text-white py-3.5 rounded-lg font-semibold hover:bg-[#3F4E40] transition-colors disabled:opacity-50"
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

            <p className="mt-4 text-center text-xs text-[#B5B89B]">
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
