"use client"

import { useState, useEffect } from "react"

const NOTICES = [
  "Free shipping on orders over $100",
  "New collection available now",
  "Subscribe to our newsletter for exclusive offers",
]

export default function NoticeBanner() {
  const [currentNotice, setCurrentNotice] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % NOTICES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return <div className="bg-black text-white text-center py-3 text-sm">{NOTICES[currentNotice]}</div>
}
