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
      className="border-t border-[#E5E0D8] pt-12"
    >
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-[#E5E0D8]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 font-semibold text-sm transition relative ${
              activeTab === tab.id ? "text-[#3F4E40]" : "text-[#B5B89B] hover:text-[#546A50]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeProductTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#546A50]"
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
            <div className="space-y-4 max-w-2xl">
              <p className="text-[#546A50]/80 leading-relaxed">{product.description}</p>
              <p className="text-[#546A50]/80 leading-relaxed">
                Our {product.name.toLowerCase()} is meticulously crafted to bring elegance and functionality to your
                space. Each piece is carefully designed and inspected to ensure it meets our high quality standards.
              </p>
              <p className="text-[#546A50]/80 leading-relaxed">
                Perfect for those who appreciate fine craftsmanship and modern design. This versatile piece works well
                in various interior styles and spaces.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
              {[
                { label: "Category", value: product.category },
                { label: "Price", value: `$${product.price}` },
                { label: "Material", value: "Premium materials" },
                { label: "SKU", value: `DM-${product.id.toString().padStart(4, "0")}` },
                { label: "Dimensions", value: "Varies by product" },
                { label: "Weight", value: "Varies by product" },
              ].map((detail) => (
                <div key={detail.label}>
                  <p className="text-xs font-semibold text-[#B5B89B] uppercase tracking-wider mb-1">
                    {detail.label}
                  </p>
                  <p className="text-[#3F4E40] font-medium capitalize">{detail.value}</p>
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
                  className="border-b border-[#E5E0D8] pb-6 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-[#3F4E40]">{review.author}</p>
                      <p className="text-xs text-[#B5B89B]">{review.date}</p>
                    </div>
                    <div className="flex text-[#D2A880]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} weight="fill" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#546A50]/80 text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
