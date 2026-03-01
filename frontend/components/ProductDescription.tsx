"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "@phosphor-icons/react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
}

const TABS = [
  { id: "description", label: "Description" },
  { id: "details", label: "Details" },
  { id: "reviews", label: "Reviews" },
]

const REVIEWS = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    text: "Absolutely beautiful! The quality exceeded my expectations. It arrived perfectly packaged and looks even better in person.",
  },
  {
    id: 2,
    author: "James T.",
    rating: 5,
    date: "1 month ago",
    text: "Great product and fast shipping. Would definitely recommend to anyone looking for quality home décor.",
  },
  {
    id: 3,
    author: "Emma L.",
    rating: 4,
    date: "2 months ago",
    text: "Very nice item. A little smaller than expected, but still very satisfied with my purchase.",
  },
]

export default function ProductDescription({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border-t border-[#E8E3DA] pt-12"
    >
      {/* Tabs */}
      <div className="flex gap-10 mb-10 border-b border-[#E8E3DA]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors relative ${
              activeTab === tab.id
                ? "text-[#2C3B2D]"
                : "text-[#B8BCA0] hover:text-[#6B7C5E]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeProductTab"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2C3B2D]"
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mb-12"
        >
          {activeTab === "description" && (
            <div className="space-y-5 max-w-2xl">
              <p className="text-[#6B7C5E] leading-[1.8] text-[0.9375rem]">{product.description}</p>
              <p className="text-[#6B7C5E] leading-[1.8] text-[0.9375rem]">
                Our {product.name.toLowerCase()} is meticulously crafted to bring elegance and functionality to your
                space. Each piece is carefully designed and inspected to meet our exacting quality standards.
              </p>
              <p className="text-[#6B7C5E] leading-[1.8] text-[0.9375rem]">
                Perfect for those who appreciate fine craftsmanship and modern design — a versatile piece that 
                works beautifully across various interior styles.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl">
              {[
                { label: "Category", value: product.category },
                { label: "Price", value: `$${product.price}` },
                { label: "Material", value: "Premium materials" },
                { label: "SKU", value: `DM-${product.id.toString().padStart(4, "0")}` },
                { label: "Dimensions", value: "Varies by product" },
                { label: "Weight", value: "Varies by product" },
              ].map((detail) => (
                <div key={detail.label}>
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B8BCA0] mb-1.5">
                    {detail.label}
                  </p>
                  <p className="text-[#2C3B2D] text-sm font-medium capitalize">{detail.value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-2xl">
              {REVIEWS.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="pb-6 border-b border-[#E8E3DA] last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-[#2C3B2D] text-sm">{review.author}</p>
                      <p className="text-xs text-[#B8BCA0] mt-0.5">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5 text-[#C7956D]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={12} weight="fill" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#6B7C5E] text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
