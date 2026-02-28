"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import PageTransition from "@/components/PageTransition"

export default function Profile() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const orders = [
    { id: "001", date: "October 15, 2024", total: "$234.50", status: "Delivered", statusColor: "text-green-600" },
    { id: "002", date: "October 8, 2024", total: "$156.75", status: "In Transit", statusColor: "text-blue-600" },
    { id: "003", date: "September 30, 2024", total: "$89.99", status: "Delivered", statusColor: "text-green-600" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NoticeBanner />
      <Header cartCount={0} />

      <PageTransition>
        <div className="flex-1 max-w-4xl mx-auto w-full py-16 px-4 mt-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            My Profile
          </motion.h1>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* User Info */}
            <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                {[
                  { label: "Name", value: "John Doe" },
                  { label: "Email", value: "john@example.com" },
                  { label: "Phone", value: "+1 (555) 123-4567" },
                  { label: "Address", value: "123 Main Street, City, State 12345" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order History */}
            <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Total: {order.total}</p>
                    <p className={`text-sm font-medium ${order.statusColor}`}>{order.status}</p>
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
