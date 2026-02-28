"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/admin/products")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl bg-white rounded-lg p-8 shadow-sm border border-[#E5E0D8]"
    >
      <h1 className="text-3xl font-bold text-[#546A50] mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#546A50] font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#546A50]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#546A50] font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#546A50]"
              required
            />
          </div>
          <div>
            <label className="block text-[#546A50] font-semibold mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#546A50]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#546A50] font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#546A50]"
            required
          >
            <option value="">Select a category</option>
            <option value="Vases">Vases</option>
            <option value="Pots">Pots</option>
            <option value="Bowls">Bowls</option>
            <option value="Candles">Candles</option>
          </select>
        </div>

        <div>
          <label className="block text-[#546A50] font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#546A50]"
            required
          />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex-1 bg-[#546A50] text-white py-3 font-semibold rounded-lg hover:bg-[#3F4E40] transition"
          >
            Add Product
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-[#E5E0D8] text-[#546A50] py-3 font-semibold rounded-lg hover:bg-[#D5D0C8] transition"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
