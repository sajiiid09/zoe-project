"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { EnvelopeSimple, Phone, MapPin, Clock, PaperPlaneRight } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"

const contactInfo = [
  { title: "Email", content: "hello@decormade.com", icon: EnvelopeSimple },
  { title: "Phone", content: "+1 (555) 123-4567", icon: Phone },
  { title: "Address", content: "123 Design Street\nCreative City, CC 12345", icon: MapPin },
  { title: "Hours", content: "Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: Closed", icon: Clock },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 4000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      <PageTransition>
        <div className="flex-1 max-w-5xl mx-auto w-full py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#3F4E40] mb-3">Contact Us</h1>
            <p className="text-[#B5B89B] max-w-md mx-auto">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-semibold text-[#3F4E40] mb-2">Get in Touch</h2>
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3F0] flex items-center justify-center flex-shrink-0">
                      <Icon size={20} weight="bold" className="text-[#D2A880]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3F4E40] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#B5B89B] whitespace-pre-line leading-relaxed">{item.content}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                >
                  Thank you for your message! We&apos;ll get back to you soon.
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Subject", name: "subject", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-[#3F4E40] mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7EBAAD] text-[#3F4E40] placeholder-[#B5B89B] text-sm resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#546A50] text-white py-3 rounded-lg font-semibold hover:bg-[#3F4E40] transition-colors"
                >
                  <PaperPlaneRight size={18} weight="bold" /> Send Message
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}
