"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import PageTransition from "@/components/PageTransition"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  const [cart, setCart] = useState<any[]>([])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NoticeBanner />
      <Header cartCount={cart.length} />

      <PageTransition>
        {/* Hero Section */}
        <section className="w-full relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/15 z-10"></div>
          <Image
            src="/eco-friendly-products-hero-background.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 text-center px-4 max-w-2xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance">Save our planet with style.</h1>
            <p className="text-xl md:text-2xl text-white mb-8 text-balance">
              We use materials made by planet Earth to make products that you actually want to use.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/shop"
                className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 1 */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full py-20 px-4 bg-white"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="flex justify-center">
              <Image
                src="/eco-friendly-ceramic-product.jpg"
                alt="Featured product"
                width={500}
                height={500}
                className="w-full max-w-md"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Crafted with Purpose</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Each product is thoughtfully designed and created using sustainable materials sourced directly from
                nature. We believe that style and sustainability can go hand in hand.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full py-20 px-4 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sustainable Living</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our commitment to the environment goes beyond our products. We use eco-friendly packaging, support
                sustainable farming practices, and give back to environmental initiatives.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="inline-block bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2 flex justify-center">
              <Image
                src="/sustainable-eco-friendly-lifestyle.jpg"
                alt="Sustainable living"
                width={500}
                height={500}
                className="w-full max-w-md"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <section className="w-full relative py-32 px-4 overflow-hidden" style={{ backgroundColor: "#2d5a1f" }}>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image src="/green-nature-forest-background.jpg" alt="Nature background" fill className="object-cover" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-20 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">Join the Movement</h2>
            <p className="text-xl text-white mb-8 text-balance">
              Be part of a community that values quality, sustainability, and style. Together, we're making a difference
              for our planet.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/shop"
                className="inline-block bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition"
              >
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 4 */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full py-20 px-4 bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center"
            >
              Our Collections
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Aromabox", desc: "Aromatic experiences" },
                { name: "Aromacup", desc: "Sustainable drinkware" },
                { name: "Bamboo Ceramics", desc: "Natural elegance" },
              ].map((collection) => (
                <motion.div key={collection.name} variants={itemVariants}>
                  <Link
                    href="/shop"
                    className="group relative overflow-hidden rounded-lg h-64 flex items-end justify-start p-6 bg-gray-200 hover:shadow-xl transition"
                  >
                    <Image
                      src={`/.jpg?height=400&width=400&query=${collection.name.toLowerCase()}-collection`}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
                      <p className="text-white text-sm">{collection.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </PageTransition>

      <Footer />
    </div>
  )
}
