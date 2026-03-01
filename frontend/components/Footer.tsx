"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { InstagramLogo, PinterestLogo, TwitterLogo, ArrowUpRight } from "@phosphor-icons/react"

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "Vases & Ceramics", href: "/shop?category=vases" },
    { label: "Lighting", href: "/shop?category=lamps" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Become a Vendor", href: "/register" },
    { label: "Careers", href: "/about" },
  ],
  help: [
    { label: "Shipping & Returns", href: "/contact" },
    { label: "Care Guide", href: "/about" },
    { label: "FAQ", href: "/contact" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#2C3B2D] text-[#FDFCFA] relative overflow-hidden">
      {/* Decorative top edge */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C7956D]/40 to-transparent" />

      {/* Newsletter Section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-medium leading-[1.1] mb-4"
            >
              Stay in the
              <br />
              <span className="italic text-[#C7956D]">conversation</span>
            </motion.h2>
            <p className="text-[#FDFCFA]/50 text-sm max-w-sm leading-relaxed">
              New collections, design inspiration, and exclusive offers — delivered to your inbox.
            </p>
          </div>
          <div className="flex items-end">
            <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border-b border-[#FDFCFA]/20 text-[#FDFCFA] placeholder-[#FDFCFA]/30 py-3 text-sm font-body focus:outline-none focus:border-[#C7956D] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C7956D] text-[#FDFCFA] text-xs font-medium tracking-[0.1em] uppercase hover:bg-[#B8855D] transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDFCFA]/40 mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FDFCFA]/60 hover:text-[#FDFCFA] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDFCFA]/40 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FDFCFA]/60 hover:text-[#FDFCFA] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDFCFA]/40 mb-5">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FDFCFA]/60 hover:text-[#FDFCFA] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDFCFA]/40 mb-5">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-[#FDFCFA]/40 hover:text-[#C7956D] transition-colors duration-300">
                <InstagramLogo size={20} weight="light" />
              </a>
              <a href="#" className="text-[#FDFCFA]/40 hover:text-[#C7956D] transition-colors duration-300">
                <PinterestLogo size={20} weight="light" />
              </a>
              <a href="#" className="text-[#FDFCFA]/40 hover:text-[#C7956D] transition-colors duration-300">
                <TwitterLogo size={20} weight="light" />
              </a>
            </div>
            <p className="text-xs text-[#FDFCFA]/30 leading-relaxed">
              hello@decormade.com
              <br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#FDFCFA]/10 gap-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em]">
            Decormade
          </Link>
          <p className="text-[10px] text-[#FDFCFA]/30 tracking-[0.1em] uppercase">
            &copy; {new Date().getFullYear()} Decormade. Crafted with intention.
          </p>
          <a
            href="#"
            className="flex items-center gap-1 text-[10px] text-[#FDFCFA]/30 tracking-[0.1em] uppercase hover:text-[#FDFCFA]/60 transition-colors"
          >
            Back to top <ArrowUpRight size={10} weight="bold" />
          </a>
        </div>
      </div>
    </footer>
  )
}
