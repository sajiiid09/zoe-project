"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ProductDetails({ product, onAddToCart }: any) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
    >
      {/* Product Image */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"
        >
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col justify-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="text-gray-600">(128 reviews)</p>
        </div>

        <p className="text-3xl font-bold text-gray-900 mb-6">${product.price}</p>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

        <div className="space-y-4 mb-8">
          <p className="text-sm text-gray-500 font-semibold">QUANTITY</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              −
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-[#546A50] text-white py-4 rounded-lg hover:bg-[#3F4E40] transition font-semibold text-lg"
          >
            Add to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Buy Now
          </motion.button>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-sm text-gray-600 mb-4">
            Free shipping on orders over $50. Same-day delivery available in select areas.
          </p>
          <p className="text-sm text-gray-600">30-day money-back guarantee. Premium packaging included.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
