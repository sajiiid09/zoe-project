"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

const mockProducts = [
  { id: 1, name: "Ceramic Vase", price: 89.99, stock: 24, category: "Vases", image: "/ceramic-vase.png" },
  { id: 2, name: "Plant Pot", price: 45.99, stock: 52, category: "Pots", image: "/terracotta-pot-succulent.png" },
  { id: 3, name: "Wooden Bowl", price: 67.99, stock: 18, category: "Bowls", image: "/wooden-bowl.png" },
  { id: 4, name: "Glass Candle", price: 34.99, stock: 95, category: "Candles", image: "/glass-candle.jpg" },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(mockProducts)

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#546A50]">Products Management</h1>
        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 bg-[#546A50] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3F4E40] transition"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E0D8]"
      >
        <div className="mb-6 flex items-center gap-2 bg-[#F5F3F0] px-4 py-2 rounded-lg">
          <Search size={20} className="text-[#B5B89B]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#546A50] flex-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                <th className="text-left py-3 px-4 font-semibold text-[#546A50]">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-[#546A50]">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-[#546A50]">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-[#546A50]">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-[#546A50]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-[#E5E0D8] hover:bg-[#F5F3F0] transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover bg-[#E5E0D8]"
                      />
                      <span className="font-semibold text-[#546A50]">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#546A50]">${product.price}</td>
                  <td className="py-3 px-4 text-[#B5B89B]">{product.category}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 50
                          ? "bg-green-100 text-green-700"
                          : product.stock > 20
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-[#7EBAAD] hover:bg-[#F5F3F0] rounded transition"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
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
