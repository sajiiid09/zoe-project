"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { EnvelopeSimple, Lock, User, Storefront, ArrowRight } from "@phosphor-icons/react"
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
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="h-[72px]" />
        <div className="flex-1 flex min-h-[calc(100vh-72px)]">
          {/* Left — Image */}
          <div className="hidden lg:block relative w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=1600&fit=crop&q=80"
              alt="Interior design"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#2C3B2D]/30" />
            <div className="absolute bottom-12 left-12 right-12 z-10">
              <p className="font-display text-3xl text-[#FDFCFA] font-medium leading-snug">
                &ldquo;Design is not just <br />what it <span className="italic">looks</span> like — <br />it&apos;s how it <span className="italic">works.&rdquo;</span>
              </p>
              <p className="text-[#FDFCFA]/50 text-xs mt-3 tracking-wider uppercase">— Steve Jobs</p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-sm"
            >
              <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
                Join Us
              </p>
              <h1 className="font-display text-4xl font-medium text-[#2C3B2D] mb-2">
                Create <span className="italic">account</span>
              </h1>
              <p className="text-sm text-[#6B7C5E] mb-8">
                Join the Decormade community today.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeSimple size={16} weight="light" className="absolute left-0 top-1/2 -translate-y-1/2 text-[#B8BCA0]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent border-b border-[#E8E3DA] pl-6 py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} weight="light" className="absolute left-0 top-1/2 -translate-y-1/2 text-[#B8BCA0]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent border-b border-[#E8E3DA] pl-6 py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} weight="light" className="absolute left-0 top-1/2 -translate-y-1/2 text-[#B8BCA0]" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full bg-transparent border-b border-[#E8E3DA] pl-6 py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-3 block">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("CUSTOMER")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        role === "CUSTOMER"
                          ? "border-[#3D5A3E] bg-[#3D5A3E]/5 text-[#3D5A3E]"
                          : "border-[#E8E3DA] text-[#B8BCA0] hover:border-[#C7956D]/40 hover:text-[#6B7C5E]"
                      }`}
                    >
                      <User size={16} weight={role === "CUSTOMER" ? "fill" : "light"} />
                      Shop
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("VENDOR")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        role === "VENDOR"
                          ? "border-[#3D5A3E] bg-[#3D5A3E]/5 text-[#3D5A3E]"
                          : "border-[#E8E3DA] text-[#B8BCA0] hover:border-[#C7956D]/40 hover:text-[#6B7C5E]"
                      }`}
                    >
                      <Storefront size={16} weight={role === "VENDOR" ? "fill" : "light"} />
                      Sell
                    </button>
                  </div>
                  {role === "VENDOR" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-xs text-[#C7956D]"
                    >
                      A one-time $10 registration fee applies. You&apos;ll be redirected to payment after sign-up.
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary justify-center disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#FDFCFA] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight size={14} weight="bold" /></>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-[#6B7C5E]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#C7956D] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
