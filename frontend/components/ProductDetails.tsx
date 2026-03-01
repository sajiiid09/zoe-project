"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Minus, Plus, ShoppingBag, Heart, Truck, ArrowsClockwise, ShieldCheck } from "@phosphor-icons/react"

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
    for (let i = 0; i < quantity; i++) onAddToCart()
  }

  const perks = [
    { icon: Truck, text: "Free shipping over $50" },
    { icon: ArrowsClockwise, text: "30-day returns" },
    { icon: ShieldCheck, text: "2-year warranty" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20"
    >
      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5F2ED]"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col justify-center py-4"
      >
        <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
          {product.category}
        </p>
        <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-[#2C3B2D] leading-[1.1] mb-4">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-0.5 text-[#C7956D]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-sm">★</span>
            ))}
          </div>
          <span className="text-xs text-[#B8BCA0]">128 reviews</span>
        </div>

        <p className="font-display text-3xl font-semibold text-[#2C3B2D] mb-6">
          ${product.price}
        </p>

        <p className="text-[#6B7C5E] text-[0.9375rem] leading-[1.8] mb-8 max-w-lg">
          {product.description}
        </p>

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B8BCA0] mb-3">
            Quantity
          </p>
          <div className="inline-flex items-center border border-[#E8E3DA] rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-[#6B7C5E] hover:bg-[#F5F2ED] transition-colors"
            >
              <Minus size={14} weight="light" />
            </button>
            <span className="w-12 text-center text-sm font-medium text-[#2C3B2D]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-[#6B7C5E] hover:bg-[#F5F2ED] transition-colors"
            >
              <Plus size={14} weight="light" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="btn-primary flex-1"
          >
            <ShoppingBag size={16} weight="bold" />
            Add to Cart
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 border border-[#E8E3DA] rounded-lg flex items-center justify-center text-[#B8BCA0] hover:text-[#C7956D] hover:border-[#C7956D] transition-colors"
          >
            <Heart size={18} weight="light" />
          </motion.button>
        </div>

        {/* Perks */}
        <div className="border-t border-[#E8E3DA] pt-6 space-y-3">
          {perks.map((perk) => (
            <div key={perk.text} className="flex items-center gap-3 text-sm text-[#6B7C5E]">
              <perk.icon size={16} weight="light" className="text-[#8AADA0] flex-shrink-0" />
              {perk.text}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
