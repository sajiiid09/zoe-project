"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { EnvelopeSimple, Lock, UserPlus, User, Storefront } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)

    const result = await register({ email, password, firstName, lastName, role })

    if (result.success) {
      if (role === "VENDOR") {
        router.push("/vendor-payment")
      } else {
        router.push("/")
      }
    } else {
      setError(result.message || "Registration failed")
    }

    setIsSubmitting(false)
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
            className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#3F4E40] mb-2">Create Account</h1>
              <p className="text-[#B5B89B] text-sm">Join the Decormade community</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#3F4E40] mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5B89B]" />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#3F4E40] mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5B89B]" />
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3F4E40] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeSimple size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5B89B]" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3F4E40] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5B89B]" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3F4E40] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5B89B]" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                    placeholder="Repeat your password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F4E40] mb-2">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                      role === "CUSTOMER"
                        ? "border-[#546A50] bg-[#546A50]/5 text-[#546A50]"
                        : "border-[#E5E0D8] text-[#B5B89B] hover:border-[#7EBAAD]"
                    }`}
                  >
                    <User size={18} weight="bold" />
                    Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("VENDOR")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                      role === "VENDOR"
                        ? "border-[#546A50] bg-[#546A50]/5 text-[#546A50]"
                        : "border-[#E5E0D8] text-[#B5B89B] hover:border-[#7EBAAD]"
                    }`}
                  >
                    <Storefront size={18} weight="bold" />
                    Sell
                  </button>
                </div>
                {role === "VENDOR" && (
                  <p className="mt-2 text-xs text-[#7EBAAD]">
                    A one-time $10 registration fee is required. You&apos;ll be redirected to payment after sign-up.
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#546A50] text-white py-3 rounded-lg font-semibold hover:bg-[#3F4E40] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={18} weight="bold" /> Create Account</>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-[#B5B89B]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#546A50] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
