"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NOTICES = [
  "Free shipping on orders over $100",
  "New collection available now — Shop the latest pieces",
  "Subscribe & get 10% off your first order",
]

export default function NoticeBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % NOTICES.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#3F4E40] text-white text-center py-2.5 text-sm font-medium tracking-wide overflow-hidden relative h-9 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute"
        >
          {NOTICES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
