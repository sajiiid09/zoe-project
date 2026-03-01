"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NOTICES = [
  "Complimentary shipping on orders over $100",
  "New collection: Autumn Botanicals — Available now",
  "Subscribe & receive 10% off your first order",
]

export default function NoticeBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % NOTICES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#2C3B2D] text-[#FDFCFA]/80 text-center py-2 text-[11px] font-body font-medium tracking-[0.15em] uppercase overflow-hidden relative h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute"
        >
          {NOTICES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
