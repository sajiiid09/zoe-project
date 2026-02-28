"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
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
    } else {
      setError(result.message || "Login failed")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <PageTransition>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-xl p-8 shadow-sm"
          >
            <h1 className="text-3xl font-bold text-[#546A50] mb-6 text-center">Welcome Back</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3F4E40] mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3F4E40] mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40]"
                  placeholder="Enter your password"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#546A50] text-white py-3 rounded-lg font-semibold hover:bg-[#3F4E40] transition disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-[#B5B89B]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#546A50] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
