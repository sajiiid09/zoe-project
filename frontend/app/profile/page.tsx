"use client"

import { motion } from "framer-motion"
import { User, EnvelopeSimple, Phone, MapPin, Package, SignOut, ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const orders = [
    { id: "001", date: "October 15, 2024", total: "$234.50", status: "Delivered", color: "bg-[#3D5A3E]/10 text-[#3D5A3E]" },
    { id: "002", date: "October 8, 2024", total: "$156.75", status: "In Transit", color: "bg-[#8AADA0]/15 text-[#2C3B2D]" },
    { id: "003", date: "September 30, 2024", total: "$89.99", status: "Delivered", color: "bg-[#3D5A3E]/10 text-[#3D5A3E]" },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
        <Header />
        <div className="h-[72px]" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#6B7C5E] mb-4">Please log in to view your profile.</p>
            <Link href="/login" className="text-[#C7956D] font-medium hover:underline">
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const accountInfo = [
    { label: "Name", value: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—", icon: User },
    { label: "Email", value: user?.email || "—", icon: EnvelopeSimple },
    { label: "Phone", value: "Not provided", icon: Phone },
    { label: "Address", value: "Not provided", icon: MapPin },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="h-[72px]" />
        <div className="max-w-5xl mx-auto w-full px-6 lg:px-10 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
                Account
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D]">
                My <span className="italic">Profile</span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <SignOut size={14} weight="bold" /> Sign Out
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-[#F5F2ED] rounded-2xl p-7"
            >
              <h2 className="text-xs tracking-[0.15em] uppercase text-[#6B7C5E] font-medium mb-6">
                Account Details
              </h2>
              <div className="space-y-5">
                {accountInfo.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FDFCFA] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={15} weight="light" className="text-[#C7956D]" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-[#B8BCA0] mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm text-[#2C3B2D] font-medium">{item.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 bg-[#F5F2ED] rounded-2xl p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs tracking-[0.15em] uppercase text-[#6B7C5E] font-medium">
                  Recent Orders
                </h2>
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#B8BCA0]">
                  {orders.length} orders
                </span>
              </div>
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-4 bg-[#FDFCFA] rounded-xl px-5 py-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#C7956D]/10 flex items-center justify-center flex-shrink-0">
                      <Package size={16} weight="light" className="text-[#C7956D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-[#2C3B2D]">Order #{order.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${order.color}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#B8BCA0]">{order.date}</p>
                    </div>
                    <p className="text-sm font-medium text-[#2C3B2D]">{order.total}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link href="/shop" className="btn-outline">
              Continue Shopping <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
