"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ProductDescription({ product }: any) {
  const [activeTab, setActiveTab] = useState("description")

  const tabs = [
    { id: "description", label: "Description" },
    { id: "details", label: "Details" },
    { id: "reviews", label: "Reviews" },
  ]

  const reviews = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border-t border-gray-200 pt-12"
    >
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 font-semibold transition relative ${
              activeTab === tab.id ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#546A50]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            <p className="text-gray-700 leading-relaxed">
              Our {product.name.toLowerCase()} is meticulously crafted to bring elegance and functionality to your
              space. Each piece is carefully designed and inspected to ensure it meets our high quality standards.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for those who appreciate fine craftsmanship and modern design. This versatile piece works well in
              various interior styles and spaces.
            </p>
          </motion.div>
        )}

        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Category</p>
                <p className="text-gray-600 capitalize">{product.category}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Price</p>
                <p className="text-gray-600">${product.price}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Material</p>
                <p className="text-gray-600">Premium materials</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">SKU</p>
                <p className="text-gray-600">DM-{product.id.toString().padStart(4, "0")}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Dimensions</p>
                <p className="text-gray-600">Varies by product</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weight</p>
                <p className="text-gray-600">Varies by product</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
