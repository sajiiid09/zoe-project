"use client"

import { motion } from "framer-motion"
import { User, EnvelopeSimple, Phone, MapPin, Package, SignOut } from "@phosphor-icons/react"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const orders = [
    { id: "001", date: "October 15, 2024", total: "$234.50", status: "Delivered", statusColor: "bg-green-100 text-green-700" },
    { id: "002", date: "October 8, 2024", total: "$156.75", status: "In Transit", statusColor: "bg-blue-100 text-blue-700" },
    { id: "003", date: "September 30, 2024", total: "$89.99", status: "Delivered", statusColor: "bg-green-100 text-green-700" },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#B5B89B] mb-4">Please log in to view your profile.</p>
            <a href="/login" className="text-[#546A50] font-semibold hover:underline">Sign In</a>
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
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      <PageTransition>
        <div className="flex-1 max-w-4xl mx-auto w-full py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-bold text-[#3F4E40]">My Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm font-medium"
            >
              <SignOut size={16} weight="bold" /> Logout
            </motion.button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#3F4E40] mb-6">Account Information</h2>
              <div className="space-y-5">
                {accountInfo.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F5F3F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={18} weight="bold" className="text-[#546A50]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#B5B89B] uppercase tracking-wide">{item.label}</label>
                        <p className="text-[#3F4E40] font-medium">{item.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#3F4E40] mb-6">Order History</h2>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-start gap-3 pb-4 border-b border-[#E5E0D8] last:border-b-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#F5F3F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package size={18} weight="bold" className="text-[#D2A880]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#3F4E40]">Order #{order.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#B5B89B]">{order.date}</p>
                      <p className="text-sm font-semibold text-[#546A50] mt-1">{order.total}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
