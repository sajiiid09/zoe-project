"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Minus, Plus, ShoppingBag, Lightning, Truck, ArrowsClockwise } from "@phosphor-icons/react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
}

interface ProductDetailsProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductDetails({ product, onAddToCart }: ProductDetailsProps) {
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
      className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16"
    >
      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full aspect-square bg-[#F5F3F0] rounded-2xl overflow-hidden"
      >
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col justify-center"
      >
        <span className="text-[#D2A880] text-sm uppercase tracking-[0.2em] font-semibold mb-2">
          {product.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3F4E40] mb-4">{product.name}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex text-[#D2A880]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-lg">★</span>
            ))}
          </div>
          <span className="text-[#B5B89B] text-sm">(128 reviews)</span>
        </div>

        <p className="text-3xl font-bold text-[#546A50] mb-6">${product.price}</p>

        <p className="text-[#546A50]/70 text-base mb-8 leading-relaxed">{product.description}</p>

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#B5B89B] uppercase tracking-wider mb-3">Quantity</p>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-[#E5E0D8] rounded-lg flex items-center justify-center hover:bg-[#F5F3F0] transition-colors"
            >
              <Minus size={16} weight="bold" className="text-[#546A50]" />
            </motion.button>
            <span className="text-lg font-semibold w-8 text-center text-[#3F4E40]">{quantity}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-[#E5E0D8] rounded-lg flex items-center justify-center hover:bg-[#F5F3F0] transition-colors"
            >
              <Plus size={16} weight="bold" className="text-[#546A50]" />
            </motion.button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-[#546A50] text-white py-4 rounded-xl hover:bg-[#3F4E40] transition-colors font-semibold"
          >
            <ShoppingBag size={20} weight="bold" />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#546A50] text-[#546A50] py-4 rounded-xl hover:bg-[#546A50] hover:text-white transition-colors font-semibold"
          >
            <Lightning size={20} weight="bold" />
            Buy Now
          </motion.button>
        </div>

        {/* Perks */}
        <div className="border-t border-[#E5E0D8] pt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#546A50]/70">
            <Truck size={18} weight="duotone" className="text-[#7EBAAD] flex-shrink-0" />
            Free shipping on orders over $50. Same-day delivery available.
          </div>
          <div className="flex items-center gap-3 text-sm text-[#546A50]/70">
            <ArrowsClockwise size={18} weight="duotone" className="text-[#7EBAAD] flex-shrink-0" />
            30-day money-back guarantee. Premium packaging included.
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
