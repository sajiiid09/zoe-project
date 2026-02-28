"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag } from "@phosphor-icons/react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-[#546A50]/5 transition-shadow"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="aspect-square bg-[#F5F3F0] overflow-hidden cursor-pointer relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#546A50] text-[11px] font-semibold rounded-md uppercase tracking-wide">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-[#3F4E40] mb-1 hover:text-[#546A50] transition-colors cursor-pointer text-sm">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-[#546A50]">${product.price}</p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-[#546A50] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#3F4E40] transition-colors"
          >
            <ShoppingBag size={14} weight="bold" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
