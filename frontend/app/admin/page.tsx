"use client"

import { motion } from "framer-motion"
import { TrendUp, Package, Users, ShoppingCart } from "@phosphor-icons/react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 221 },
  { month: "Mar", revenue: 2000, orders: 229 },
  { month: "Apr", revenue: 2780, orders: 200 },
  { month: "May", revenue: 1890, orders: 229 },
  { month: "Jun", revenue: 2390, orders: 200 },
]

const recentOrders = [
  { id: 1, customer: "John Doe", amount: "$240", status: "Completed" },
  { id: 2, customer: "Jane Smith", amount: "$180", status: "Pending" },
  { id: 3, customer: "Bob Johnson", amount: "$320", status: "Processing" },
]

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "$12,450", icon: TrendUp, color: "#3D5A3E" },
    { label: "Total Orders", value: "342", icon: ShoppingCart, color: "#8AADA0" },
    { label: "Total Products", value: "48", icon: Package, color: "#C7956D" },
    { label: "Total Users", value: "1,240", icon: Users, color: "#6B7C5E" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7C5E] text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#3D5A3E] mt-2">{stat.value}</p>
                </div>
                <Icon size={32} weight="bold" color={stat.color} className="opacity-20" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <h3 className="text-lg font-bold text-[#3D5A3E] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DA" />
              <XAxis stroke="#6B7C5E" />
              <YAxis stroke="#6B7C5E" />
              <Tooltip contentStyle={{ backgroundColor: "#F5F2ED", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3D5A3E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <h3 className="text-lg font-bold text-[#3D5A3E] mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DA" />
              <XAxis stroke="#6B7C5E" />
              <YAxis stroke="#6B7C5E" />
              <Tooltip contentStyle={{ backgroundColor: "#F5F2ED", border: "none" }} />
              <Legend />
              <Bar dataKey="orders" fill="#8AADA0" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
      >
        <h3 className="text-lg font-bold text-[#3D5A3E] mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3DA]">
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E8E3DA] hover:bg-[#F5F2ED] transition">
                  <td className="py-3 px-4 text-[#3D5A3E]">{order.customer}</td>
                  <td className="py-3 px-4 text-[#3D5A3E] font-semibold">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
