"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Check, Minus, Plus, Trash2 } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useCart } from "@/context/CartContext"

export default function CheckoutPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    saveInfo: false,
  })

  useEffect(() => {
    setMounted(true)
    // Load saved shipping info if available
    const saved = localStorage.getItem("decormade-shipping-info")
    if (saved) {
      try {
        const info = JSON.parse(saved)
        setFormData((prev) => ({ ...prev, ...info, saveInfo: false }))
      } catch (error) {
        console.error("Error loading saved shipping info:", error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setOrderNumber(`ORD-${Date.now().toString().slice(-8)}`)

    if (formData.saveInfo) {
      try {
        localStorage.setItem(
          "decormade-shipping-info",
          JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            postalCode: formData.postalCode,
          }),
        )
      } catch (error) {
        console.error("Error saving shipping info:", error)
      }
    }

    clearCart()
    setIsProcessing(false)
    setOrderConfirmed(true)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 100 ? 0 : 9.99
  const finalTotal = subtotal + deliveryFee

  if (!mounted) {
    return <div className="min-h-screen bg-white" />
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header cartCount={items.length} />
        <PageTransition>
          <div className="flex-1 flex items-center justify-center px-4 py-20">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7EBAAD]/20 mb-6"
              >
                <Check className="w-10 h-10 text-[#546A50]" />
              </motion.div>
              <h1 className="text-4xl font-bold text-[#546A50] mb-4">Order Confirmed!</h1>
              <p className="text-[#B5B89B] mb-2">Thank you for your purchase. Your order has been received.</p>
              <p className="text-sm text-[#B5B89B] mb-8">
                Order Number: <span className="font-semibold text-[#546A50]">{orderNumber}</span>
              </p>
              <Link
                href="/"
                className="inline-block bg-[#546A50] text-white px-8 py-3 font-semibold hover:bg-[#3F4E40] transition rounded-lg"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartCount={items.length} />
      <PageTransition>
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <Link href="/shop" className="flex items-center text-[#546A50] hover:text-[#3F4E40] mb-8 transition">
            <ChevronLeft size={20} />
            <span className="ml-2">Back to Shop</span>
          </Link>

          <h1 className="text-4xl font-bold text-[#546A50] mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Cart Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-[#E5E0D8] p-8">
                <h2 className="text-2xl font-bold text-[#546A50] mb-6">Cart Summary</h2>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#B5B89B] text-lg mb-4">Your cart is empty</p>
                    <Link
                      href="/shop"
                      className="text-[#546A50] font-semibold hover:text-[#3F4E40] underline transition"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <AnimatePresence mode="popLayout">
                      <div className="space-y-4 mb-6">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-4 pb-6 border-b border-[#E5E0D8] last:border-0"
                          >
                            {/* Product Image */}
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#F5F5F0]">
                              <img
                                src={
                                  item.image ||
                                  `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(item.name)}`
                                }
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#546A50] mb-1 text-sm md:text-base">{item.name}</h3>
                              <p className="text-[#B5B89B] text-sm mb-3">${item.price.toFixed(2)} each</p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 mb-3">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={isProcessing}
                                  className="w-8 h-8 flex items-center justify-center border border-[#E5E0D8] rounded hover:bg-[#F5F5F0] hover:border-[#D2A880] transition text-[#B5B89B] hover:text-[#546A50] disabled:opacity-50"
                                >
                                  <Minus size={16} />
                                </motion.button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                  disabled={isProcessing}
                                  className="w-16 text-center border border-[#E5E0D8] rounded py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#546A50] bg-white text-[#546A50] disabled:opacity-50"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={isProcessing}
                                  className="w-8 h-8 flex items-center justify-center border border-[#E5E0D8] rounded hover:bg-[#F5F5F0] hover:border-[#D2A880] transition text-[#B5B89B] hover:text-[#546A50] disabled:opacity-50"
                                >
                                  <Plus size={16} />
                                </motion.button>
                              </div>

                              {/* Subtotal and Remove */}
                              <div className="flex items-center justify-between">
                                <p className="text-[#546A50] font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeFromCart(item.id)}
                                  disabled={isProcessing}
                                  className="text-[#D2A880] hover:text-[#3F4E40] text-sm font-medium transition flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                  Remove
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>

                    {/* Total Section */}
                    <div className="pt-6 border-t border-[#E5E0D8] mt-6 space-y-3">
                      <div className="flex justify-between text-[#B5B89B]">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#B5B89B]">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#546A50] pt-3 border-t border-[#E5E0D8]">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Section - Shipping Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg border border-[#E5E0D8] p-8 sticky top-24"
              >
                <h2 className="text-xl font-bold text-[#546A50] mb-6">Shipping Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#546A50] mb-2">
                      Full Name *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#546A50] mb-2">
                      Email *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#546A50] mb-2">
                      Phone Number *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label htmlFor="address1" className="block text-sm font-medium text-[#546A50] mb-2">
                      Address Line 1 *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="address1"
                      name="address1"
                      type="text"
                      required
                      placeholder="123 Main Street"
                      value={formData.address1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label htmlFor="address2" className="block text-sm font-medium text-[#546A50] mb-2">
                      Address Line 2 <span className="text-[#B5B89B] font-normal text-xs">(Optional)</span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="address2"
                      name="address2"
                      type="text"
                      placeholder="Apartment, suite, etc."
                      value={formData.address2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                    />
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#546A50] mb-2">
                        City *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="city"
                        name="city"
                        type="text"
                        required
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-[#546A50] mb-2">
                        Postal Code *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        placeholder="10001"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546A50] transition bg-white text-[#546A50] placeholder-[#B5B89B]"
                      />
                    </div>
                  </div>

                  {/* Save Information Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      id="saveInfo"
                      name="saveInfo"
                      type="checkbox"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-[#546A50] border-[#E5E0D8] rounded focus:ring-[#546A50] cursor-pointer"
                    />
                    <label htmlFor="saveInfo" className="ml-3 text-sm text-[#B5B89B]">
                      Save this information for next time
                    </label>
                  </div>

                  {/* Payment Summary */}
                  <div className="pt-6 border-t border-[#E5E0D8] mt-6">
                    <h3 className="text-lg font-semibold text-[#546A50] mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-[#B5B89B]">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#B5B89B]">
                        <span>Delivery</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#546A50] pt-2 border-t border-[#E5E0D8]">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Order Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isProcessing || items.length === 0}
                    className="w-full bg-[#546A50] text-white py-3.5 rounded-lg hover:bg-[#3F4E40] transition font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm Order</span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
