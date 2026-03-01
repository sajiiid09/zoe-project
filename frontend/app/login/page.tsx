"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { EnvelopeSimple, Lock, ArrowRight } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/")
    } else if (result.requiresPayment) {
      router.push("/vendor-payment")
    } else {
      setError(result.message || "Login failed")
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
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=1600&fit=crop&q=80"
              alt="Interior"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#2C3B2D]/30" />
            <div className="absolute bottom-12 left-12 right-12 z-10">
              <p className="font-display text-3xl text-[#FDFCFA] font-medium leading-snug">
                &ldquo;Good design is <br /><span className="italic">obvious.</span> Great design <br />is <span className="italic">transparent.&rdquo;</span>
              </p>
              <p className="text-[#FDFCFA]/50 text-xs mt-3 tracking-wider uppercase">— Joe Sparano</p>
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
                Welcome Back
              </p>
              <h1 className="font-display text-4xl font-medium text-[#2C3B2D] mb-2">
                Sign <span className="italic">in</span>
              </h1>
              <p className="text-sm text-[#6B7C5E] mb-10">
                Enter your credentials to access your account.
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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your password"
                      className="w-full bg-transparent border-b border-[#E8E3DA] pl-6 py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary justify-center disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#FDFCFA] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={14} weight="bold" /></>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-[#6B7C5E]">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#C7956D] font-medium hover:underline">
                  Create one
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
