"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MagnifyingGlass, Eye } from "@phosphor-icons/react"

const mockOrders = [
  { id: "ORD-001", customer: "John Doe", total: "$320", status: "Completed", date: "2024-03-15" },
  { id: "ORD-002", customer: "Jane Smith", total: "$185", status: "Processing", date: "2024-03-18" },
  { id: "ORD-003", customer: "Bob Johnson", total: "$425", status: "Pending", date: "2024-03-19" },
  { id: "ORD-004", customer: "Alice Williams", total: "$280", status: "Completed", date: "2024-03-20" },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders] = useState(mockOrders)

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3D5A3E]">Orders Management</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
      >
        <div className="mb-6 flex items-center gap-2 bg-[#F5F2ED] px-4 py-2 rounded-lg">
          <MagnifyingGlass size={20} weight="bold" className="text-[#6B7C5E]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#3D5A3E] flex-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3DA]">
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-[#E8E3DA] hover:bg-[#F5F2ED] transition"
                >
                  <td className="py-3 px-4 font-semibold text-[#3D5A3E]">{order.id}</td>
                  <td className="py-3 px-4 text-[#3D5A3E]">{order.customer}</td>
                  <td className="py-3 px-4 text-[#6B7C5E]">{order.date}</td>
                  <td className="py-3 px-4 font-semibold text-[#3D5A3E]">{order.total}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-[#8AADA0] hover:bg-[#F5F2ED] rounded transition"
                    >
                      <Eye size={18} weight="bold" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
