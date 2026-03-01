"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { CaretLeft, CheckCircle, Minus, Plus, Trash, ArrowRight, ShieldCheck, Truck } from "@phosphor-icons/react"
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
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
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

  if (!mounted) return <div className="min-h-screen bg-[#FDFCFA]" />

  /* ── Order Confirmed ── */
  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
        <Header />
        <PageTransition>
          <div className="h-[72px]" />
          <div className="flex-1 flex items-center justify-center px-6 py-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center max-w-md"
            >
              <div className="w-16 h-16 rounded-full bg-[#3D5A3E]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} weight="fill" className="text-[#3D5A3E]" />
              </div>
              <h1 className="font-display text-4xl font-medium text-[#2C3B2D] mb-3">
                Order <span className="italic">confirmed</span>
              </h1>
              <p className="text-[#6B7C5E] text-sm mb-2">Thank you for your purchase.</p>
              <p className="text-xs text-[#B8BCA0] mb-10">
                Order Number: <span className="font-medium text-[#2C3B2D]">{orderNumber}</span>
              </p>
              <Link href="/shop" className="btn-primary">
                Continue Shopping <ArrowRight size={14} weight="bold" />
              </Link>
            </motion.div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    )
  }

  /* ── Input helper ── */
  const inputClass =
    "w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        <div className="h-[72px]" />
        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-12">
          {/* Back & Title */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs tracking-[0.1em] uppercase text-[#6B7C5E] hover:text-[#C7956D] transition-colors mb-8"
          >
            <CaretLeft size={12} weight="bold" /> Back to Shop
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-2">
              Review & Pay
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D] mb-10">
              Checkout
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* ── Cart Items (left) ── */}
            <div className="lg:col-span-3">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[#6B7C5E] font-medium mb-6">
                Cart ({items.length})
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-20 bg-[#F5F2ED] rounded-2xl">
                  <p className="text-[#6B7C5E] mb-4">Your cart is empty.</p>
                  <Link href="/shop" className="text-[#C7956D] text-sm font-medium hover:underline">
                    Browse products
                  </Link>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-0 divide-y divide-[#E8E3DA]">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-5 py-6 first:pt-0"
                        >
                          <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5F2ED]">
                            <Image
                              src={item.image || `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=160&h=200&fit=crop`}
                              alt={item.name}
                              width={80}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-[#2C3B2D] mb-1">{item.name}</h3>
                            <p className="text-xs text-[#B8BCA0] mb-3">${item.price.toFixed(2)} each</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isProcessing}
                                className="w-7 h-7 flex items-center justify-center border border-[#E8E3DA] rounded-lg text-[#6B7C5E] hover:border-[#C7956D] transition-colors disabled:opacity-40"
                              >
                                <Minus size={12} weight="bold" />
                              </button>
                              <span className="text-sm text-[#2C3B2D] w-6 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isProcessing}
                                className="w-7 h-7 flex items-center justify-center border border-[#E8E3DA] rounded-lg text-[#6B7C5E] hover:border-[#C7956D] transition-colors disabled:opacity-40"
                              >
                                <Plus size={12} weight="bold" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <p className="text-sm font-medium text-[#2C3B2D]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              disabled={isProcessing}
                              className="text-[#B8BCA0] hover:text-red-400 transition-colors disabled:opacity-40"
                            >
                              <Trash size={14} weight="light" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>

                  {/* Totals */}
                  <div className="mt-8 pt-6 border-t border-[#E8E3DA] space-y-2">
                    <div className="flex justify-between text-sm text-[#6B7C5E]">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#6B7C5E]">
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium text-[#2C3B2D] pt-3 border-t border-[#E8E3DA]">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="flex items-center gap-6 mt-6 text-[10px] tracking-[0.1em] uppercase text-[#B8BCA0]">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} weight="light" /> Secure Checkout</span>
                    <span className="flex items-center gap-1.5"><Truck size={14} weight="light" /> Free over $100</span>
                  </div>
                </>
              )}
            </div>

            {/* ── Shipping Form (right) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#F5F2ED] rounded-2xl p-7 sticky top-24">
                <h2 className="text-xs tracking-[0.15em] uppercase text-[#6B7C5E] font-medium mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">Full Name *</label>
                    <input name="fullName" type="text" required placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">Email *</label>
                    <input name="email" type="email" required placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">Phone *</label>
                    <input name="phone" type="tel" required placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">Address *</label>
                    <input name="address1" type="text" required placeholder="123 Main Street" value={formData.address1} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                      Address Line 2 <span className="normal-case text-[#B8BCA0]">(optional)</span>
                    </label>
                    <input name="address2" type="text" placeholder="Apt, suite, etc." value={formData.address2} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">City *</label>
                      <input name="city" type="text" required placeholder="New York" value={formData.city} onChange={handleInputChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">Postal Code *</label>
                      <input name="postalCode" type="text" required placeholder="10001" value={formData.postalCode} onChange={handleInputChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="saveInfo"
                      name="saveInfo"
                      type="checkbox"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-3.5 h-3.5 accent-[#3D5A3E] cursor-pointer"
                    />
                    <label htmlFor="saveInfo" className="text-xs text-[#6B7C5E] cursor-pointer">
                      Save for next time
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="pt-5 mt-2 border-t border-[#E8E3DA] space-y-2 text-sm">
                    <div className="flex justify-between text-[#6B7C5E]">
                      <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#6B7C5E]">
                      <span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-medium text-[#2C3B2D] pt-2 border-t border-[#E8E3DA]">
                      <span>Total</span><span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || items.length === 0}
                    className="w-full btn-primary justify-center mt-3 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-[#FDFCFA] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Confirm Order <ArrowRight size={14} weight="bold" /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
