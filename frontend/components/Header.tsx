"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MagnifyingGlass,
  X,
  Plus,
  Minus,
  SignOut,
  User,
  ShoppingBag,
  List,
  ArrowRight,
} from "@phosphor-icons/react"
import { useCart } from "@/context/CartContext"
import { getDashboardRouteForRole, getRoleLabel } from "@/lib/auth"

export default function Header() {
  const { items, subtotal, updateQuantity } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <header
          className={`transition-all duration-500 ease-out ${
            isScrolled
              ? "bg-[#FDFCFA]/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(232,227,218,0.8)]"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between h-[72px]">
              {/* Logo */}
              <Link href="/" className="relative z-10 group">
                <span className="font-display text-[1.65rem] font-semibold tracking-[-0.03em] text-[#2C3B2D] transition-colors duration-300 group-hover:text-[#C7956D]">
                  Decormade
                </span>
              </Link>

              {/* Desktop Navigation — center */}
              <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="link-underline text-[0.8125rem] font-medium tracking-[0.06em] uppercase text-[#2C3B2D]/70 hover:text-[#2C3B2D] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                  <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                      <motion.div
                        key="search-input"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 220, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex items-center"
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-4 py-2 bg-transparent border-b border-[#2C3B2D]/20 text-sm font-body focus:outline-none focus:border-[#C7956D] text-[#2C3B2D] placeholder-[#B8BCA0] transition-colors"
                          onBlur={() => setIsSearchOpen(false)}
                          autoFocus
                        />
                      </motion.div>
                    ) : (
                      <motion.button
                        key="search-icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-[#2C3B2D]/60 hover:text-[#2C3B2D] transition-colors duration-300"
                      >
                        <MagnifyingGlass size={18} weight="light" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Auth */}
                {isAuthenticated ? (
                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 text-[#2C3B2D]/70 hover:text-[#2C3B2D] transition-colors duration-300"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#3D5A3E] flex items-center justify-center">
                        <span className="text-[#FDFCFA] text-xs font-medium">
                          {user?.firstName?.[0] || "U"}
                        </span>
                      </div>
                      <span className="hidden sm:inline text-[0.8125rem] font-medium">
                        {user?.firstName || "Account"}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-52 bg-[#FDFCFA] border border-[#E8E3DA] rounded-lg shadow-xl shadow-black/5 overflow-hidden z-50"
                          >
                            <div className="px-4 py-3 border-b border-[#E8E3DA]">
                              <p className="text-xs text-[#B8BCA0] font-medium uppercase tracking-wider">Signed in as</p>
                              <p className="text-sm text-[#2C3B2D] font-medium truncate mt-0.5">{user?.email}</p>
                            </div>
                            <div className="py-1">
                              <Link
                                href="/profile"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2C3B2D]/70 hover:text-[#2C3B2D] hover:bg-[#F5F2ED] transition-colors"
                              >
                                <User size={16} weight="light" /> Profile
                              </Link>
                              {user?.role !== "CUSTOMER" && (
                                <Link
                                  href={getDashboardRouteForRole(user?.role)}
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2C3B2D]/70 hover:text-[#2C3B2D] hover:bg-[#F5F2ED] transition-colors"
                                >
                                  <ArrowRight size={16} weight="light" /> {getRoleLabel(user?.role)} Dashboard
                                </Link>
                              )}
                            </div>
                            <div className="border-t border-[#E8E3DA] py-1">
                              <button
                                onClick={() => {
                                  logout()
                                  setShowUserMenu(false)
                                }}
                                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-[#C44E4E]/70 hover:text-[#C44E4E] hover:bg-red-50/50 transition-colors"
                              >
                                <SignOut size={16} weight="light" /> Sign Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 text-[0.8125rem] font-medium tracking-[0.04em] text-[#2C3B2D] border border-[#2C3B2D]/20 rounded-full hover:bg-[#2C3B2D] hover:text-[#FDFCFA] transition-all duration-400"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}

                {/* Cart */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative p-2 text-[#2C3B2D]/60 hover:text-[#2C3B2D] transition-colors duration-300"
                >
                  <ShoppingBag size={20} weight="light" />
                  {items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C7956D] text-[#FDFCFA] text-[9px] font-semibold rounded-full flex items-center justify-center"
                    >
                      {items.reduce((sum, i) => sum + i.quantity, 0)}
                    </motion.span>
                  )}
                </motion.button>

                {/* Mobile Menu */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-[#2C3B2D]/60 hover:text-[#2C3B2D] transition-colors"
                >
                  {isMenuOpen ? <X size={20} weight="light" /> : <List size={20} weight="light" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#FDFCFA] z-50 md:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-10">
                  <span className="font-display text-lg font-semibold text-[#2C3B2D]">Menu</span>
                  <button onClick={() => setIsMenuOpen(false)} className="text-[#2C3B2D]/50 hover:text-[#2C3B2D]">
                    <X size={20} weight="light" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-[#2C3B2D] text-lg font-display font-medium border-b border-[#E8E3DA]/50 hover:text-[#C7956D] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#FDFCFA] shadow-2xl z-[60] flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E3DA]">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#2C3B2D]">Your Cart</h2>
                  <p className="text-xs text-[#B8BCA0] mt-0.5 font-body">
                    {items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#2C3B2D]/40 hover:text-[#2C3B2D] transition-colors"
                >
                  <X size={20} weight="light" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={48} weight="thin" className="text-[#E8E3DA] mb-4" />
                    <p className="text-[#B8BCA0] text-sm">Your cart is empty</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-[#C7956D] text-sm font-medium link-underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-4 pb-4 border-b border-[#E8E3DA]/60"
                      >
                        <div className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#F5F2ED] flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#2C3B2D] text-sm leading-tight">{item.name}</h3>
                          <p className="text-[#C7956D] text-xs mt-1 font-medium">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-[#E8E3DA] rounded text-[#2C3B2D]/50 hover:border-[#C7956D] hover:text-[#C7956D] transition-colors"
                            >
                              <Minus size={10} weight="bold" />
                            </button>
                            <span className="text-xs font-medium text-[#2C3B2D] w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-[#E8E3DA] rounded text-[#2C3B2D]/50 hover:border-[#C7956D] hover:text-[#C7956D] transition-colors"
                            >
                              <Plus size={10} weight="bold" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#2C3B2D] self-start mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-[#E8E3DA] bg-[#F5F2ED]/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[#6B7C5E]">Subtotal</span>
                    <span className="text-lg font-display font-semibold text-[#2C3B2D]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Checkout
                  </Link>
                  <p className="text-center text-[10px] text-[#B8BCA0] mt-3 tracking-wider uppercase">
                    Free shipping on orders over $100
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header spacer */}
      <div className="h-[72px]" />
    </>
  )
}
