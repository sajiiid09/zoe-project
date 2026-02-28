"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Plus, Minus, LogOut, User } from "lucide-react"
import NoticeBanner from "./NoticeBanner"
import { useCart } from "@/context/CartContext"

export default function Header() {
  const { items, subtotal, updateQuantity } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -120 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <NoticeBanner />

        <header className="bg-white border-b border-[#E5E0D8]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#546A50]">
              Decormade
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[#546A50] hover:text-[#3F4E40] transition">
                Home
              </Link>
              <Link href="/shop" className="text-[#546A50] hover:text-[#3F4E40] transition">
                Shop
              </Link>
              <Link href="/about" className="text-[#546A50] hover:text-[#3F4E40] transition">
                About
              </Link>
              <Link href="/contact" className="text-[#546A50] hover:text-[#3F4E40] transition">
                Contact
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.input
                      key="search-input"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      type="text"
                      placeholder="Search..."
                      className="px-4 py-2 border border-[#E5E0D8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40]"
                      onBlur={() => setIsSearchOpen(false)}
                      autoFocus
                    />
                  ) : (
                    <motion.button
                      key="search-icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsSearchOpen(true)}
                      className="text-[#546A50] hover:text-[#3F4E40] transition"
                    >
                      <Search size={20} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#F5F3F0] text-[#546A50] rounded-lg font-semibold hover:bg-[#E5E0D8] transition"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">{user?.firstName || "Account"}</span>
                  </motion.button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E0D8] rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-[#546A50] hover:bg-[#F5F3F0] transition"
                        >
                          Profile
                        </Link>
                        {user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-[#546A50] hover:bg-[#F5F3F0] transition"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-[#546A50] text-white rounded-lg font-semibold hover:bg-[#3F4E40] transition"
                  >
                    Login
                  </motion.button>
                </Link>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <span className="text-2xl">🛒</span>
                {items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#546A50] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {items.length}
                  </motion.span>
                )}
              </motion.button>
            </div>


            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#546A50]">
              ☰
            </button>
          </div>
        </header>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-32 left-0 right-0 md:hidden bg-[#F5F3F0] border-t border-[#E5E0D8] py-4 px-4 space-y-2 z-40"
          >
            <Link href="/" className="block text-[#546A50] hover:text-[#3F4E40] py-2">
              Home
            </Link>
            <Link href="/shop" className="block text-[#546A50] hover:text-[#3F4E40] py-2">
              Shop
            </Link>
            <Link href="/about" className="block text-[#546A50] hover:text-[#3F4E40] py-2">
              About
            </Link>
            <Link href="/contact" className="block text-[#546A50] hover:text-[#3F4E40] py-2">
              Contact
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 top-32"
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-32 h-screen w-full max-w-md bg-white shadow-lg z-40 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#546A50]">Your Cart</h2>
                  <button onClick={() => setIsCartOpen(false)}>
                    <X size={24} className="text-[#546A50]" />
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-[#B5B89B]">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-3 border-b border-[#E5E0D8]">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded bg-[#F5F3F0]"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#546A50] text-sm">{item.name}</h3>
                            <p className="text-[#B5B89B] text-xs mb-2">${item.price.toFixed(2)} each</p>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-[#F5F3F0] rounded transition"
                              >
                                <Minus size={16} className="text-[#546A50]" />
                              </motion.button>
                              <span className="w-8 text-center font-semibold text-[#546A50]">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-[#F5F3F0] rounded transition"
                              >
                                <Plus size={16} className="text-[#546A50]" />
                              </motion.button>
                            </div>
                            <p className="font-semibold text-[#546A50] text-sm mt-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#E5E0D8] pt-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#546A50] font-semibold">Subtotal:</span>
                        <span className="text-[#546A50] font-bold text-lg">${subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="block w-full bg-[#546A50] text-white py-3 text-center font-semibold hover:bg-[#3F4E40] transition"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-28" />
    </>
  )
}
