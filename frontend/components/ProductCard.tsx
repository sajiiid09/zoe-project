"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function ProductCard({ product, onAddToCart }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
          <motion.img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#546A50] transition cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-gray-900 mb-4">${product.price}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}
