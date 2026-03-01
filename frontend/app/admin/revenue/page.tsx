"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
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
  { month: "Jan", revenue: 4000, target: 3500 },
  { month: "Feb", revenue: 3000, target: 3500 },
  { month: "Mar", revenue: 5200, target: 3500 },
  { month: "Apr", revenue: 4780, target: 4000 },
  { month: "May", revenue: 5890, target: 4500 },
  { month: "Jun", revenue: 6390, target: 5000 },
]

const categoryData = [
  { category: "Vases", revenue: 2400 },
  { category: "Pots", revenue: 1398 },
  { category: "Bowls", revenue: 1800 },
  { category: "Candles", revenue: 1908 },
]

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3D5A3E]">Revenue Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <p className="text-[#6B7C5E] text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-[#3D5A3E] mt-2">$25,268</p>
          <p className="text-green-600 text-sm mt-2">+12.5% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <p className="text-[#6B7C5E] text-sm font-medium">Average Order Value</p>
          <p className="text-3xl font-bold text-[#3D5A3E] mt-2">$245.80</p>
          <p className="text-green-600 text-sm mt-2">+5.3% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <p className="text-[#6B7C5E] text-sm font-medium">Total Transactions</p>
          <p className="text-3xl font-bold text-[#3D5A3E] mt-2">103</p>
          <p className="text-green-600 text-sm mt-2">+8.2% from last month</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <h3 className="text-lg font-bold text-[#3D5A3E] mb-4">Revenue vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DA" />
              <XAxis stroke="#6B7C5E" />
              <YAxis stroke="#6B7C5E" />
              <Tooltip contentStyle={{ backgroundColor: "#F5F2ED", border: "none" }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" fill="#8AADA0" stroke="#3D5A3E" />
              <Area type="monotone" dataKey="target" fill="#C7956D" stroke="#6B7C5E" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
        >
          <h3 className="text-lg font-bold text-[#3D5A3E] mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DA" />
              <XAxis stroke="#6B7C5E" />
              <YAxis stroke="#6B7C5E" />
              <Tooltip contentStyle={{ backgroundColor: "#F5F2ED", border: "none" }} />
              <Legend />
              <Bar dataKey="revenue" fill="#8AADA0" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
