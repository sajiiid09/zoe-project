"use client"

import { motion } from "framer-motion"
import { Envelope, Phone, MapPin, Clock, ArrowRight, PaperPlaneTilt } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import { useState } from "react"

const contactInfo = [
  { icon: MapPin, title: "Studio", lines: ["123 Design District", "Brooklyn, NY 11201"] },
  { icon: Phone, title: "Phone", lines: ["+1 (555) 012-3456"] },
  { icon: Envelope, title: "Email", lines: ["hello@decormade.com"] },
  { icon: Clock, title: "Hours", lines: ["Mon – Fri: 9am – 6pm", "Sat: 10am – 4pm"] },
]

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        {/* Hero */}
        <section className="h-[72px]" />
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-medium text-[#2C3B2D] leading-[1.05] mb-5">
              Contact Us
            </h1>
            <p className="text-[#6B7C5E] text-base max-w-md mx-auto leading-relaxed">
              We'd love to hear from you — whether it's a question, a project idea,
              or simply to say hello.
            </p>
          </motion.div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                  className="bg-[#F5F2ED] rounded-xl p-6 text-center"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FDFCFA] flex items-center justify-center mx-auto mb-4">
                    <Icon size={18} weight="light" className="text-[#C7956D]" />
                  </div>
                  <p className="text-xs tracking-[0.12em] uppercase text-[#2C3B2D] font-medium mb-2">
                    {item.title}
                  </p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm text-[#6B7C5E]">{line}</p>
                  ))}
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Form + Map */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-display text-3xl font-medium text-[#2C3B2D] mb-2">
                Send a <span className="italic">message</span>
              </h2>
              <p className="text-sm text-[#6B7C5E] mb-8">
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#3D5A3E]/10 border border-[#3D5A3E]/20 text-[#3D5A3E] rounded-xl px-5 py-4 text-sm mb-6 flex items-center gap-2"
                >
                  <PaperPlaneTilt size={18} weight="fill" />
                  Thank you! Your message has been sent.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Your email"
                      className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] focus:border-[#C7956D] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Business Partnership">Business Partnership</option>
                    <option value="Press & Media">Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#6B7C5E] font-medium mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-transparent border-b border-[#E8E3DA] py-3 text-sm text-[#2C3B2D] placeholder:text-[#B8BCA0] focus:border-[#C7956D] focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary mt-2">
                  Send Message <ArrowRight size={14} weight="bold" />
                </button>
              </form>
            </motion.div>

            {/* Map / Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-2xl overflow-hidden bg-[#F5F2ED] relative min-h-[400px] lg:min-h-0"
            >
              <iframe
                title="Decormade Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.3063874233135!2d-73.99!3d40.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQxJzI0LjAiTiA3M8KwNTknMjQuMCJX!5e0!3m2!1sen!2sus!4v1700000000000"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#F5F2ED] py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
                Quick Answers
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-[#2C3B2D] mb-12">
                Common <span className="italic">Questions</span>
              </h2>
            </motion.div>
            <div className="space-y-6 text-left">
              {[
                { q: "How long does shipping take?", a: "Standard shipping takes 5–7 business days. Express options are available at checkout." },
                { q: "Do you offer returns?", a: "Yes — we accept returns within 30 days of delivery. Items must be in their original condition." },
                { q: "Can I become a vendor?", a: "Absolutely! Register an account and apply for a vendor role from your dashboard." },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-[#FDFCFA] rounded-xl px-7 py-6"
                >
                  <p className="text-sm font-medium text-[#2C3B2D] mb-1">{faq.q}</p>
                  <p className="text-sm text-[#6B7C5E] leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </div>
  )
}
