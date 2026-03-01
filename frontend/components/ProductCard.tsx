"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, Plus } from "@phosphor-icons/react"

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
  index?: number
}

export default function ProductCard({ product, onAddToCart, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2ED] mb-3">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-[#FDFCFA]/90 backdrop-blur-sm text-[#2C3B2D] text-[10px] font-medium tracking-[0.1em] uppercase rounded-md">
              {product.category}
            </span>
          </div>
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-[#2C3B2D]/0 group-hover:bg-[#2C3B2D]/10 transition-colors duration-500" />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart(product)
            }}
            className="absolute bottom-3 right-3 w-10 h-10 bg-[#FDFCFA] rounded-full flex items-center justify-center shadow-lg shadow-black/10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400"
          >
            <Plus size={16} weight="bold" className="text-[#2C3B2D]" />
          </motion.button>
        </div>
      </Link>
      <div className="px-0.5">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-medium text-sm text-[#2C3B2D] group-hover:text-[#C7956D] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#6B7C5E] mt-0.5">${product.price}</p>
      </div>
    </motion.div>
  )
}
