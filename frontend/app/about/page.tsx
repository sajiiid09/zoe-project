"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Leaf, Palette, HandHeart, ShieldCheck, ArrowRight } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"

const values = [
  { title: "Quality First", desc: "We source only the finest materials and partner with skilled artisans who share our vision.", icon: ShieldCheck },
  { title: "Sustainably Made", desc: "Every piece is created with minimal environmental impact — from material to packaging.", icon: Leaf },
  { title: "Thoughtful Design", desc: "Each item is carefully curated to complement modern living spaces with timeless elegance.", icon: Palette },
  { title: "Human Connection", desc: "Behind every product is a story, a maker, and a commitment to ethical practices.", icon: HandHeart },
]

const STATS = [
  { number: "500+", label: "Artisan Partners" },
  { number: "12K", label: "Happy Homes" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "6", label: "Years of Craft" },
]

function stagger(i: number) {
  return { delay: 0.1 + i * 0.08 }
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />
      <PageTransition>
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[400px] overflow-hidden grain-overlay">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&h=800&fit=crop&q=80"
            alt="Decormade workshop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#2C3B2D]/55" />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center text-[#FDFCFA] px-6"
            >
              <p className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#C7956D] mb-4">
                Our Story
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] mb-4">
                About Decormade
              </h1>
              <p className="text-[#FDFCFA]/70 text-base md:text-lg max-w-lg mx-auto">
                Bringing elegance and sophistication to every home since 2018.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-4">
                Founded in 2018
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D] leading-[1.1] mb-6">
                A passion for
                <br />
                <span className="italic">beautiful living</span>
              </h2>
              <div className="space-y-5 text-[#6B7C5E] text-[0.9375rem] leading-[1.8]">
                <p>
                  Decormade was born from a simple belief: that the objects we surround ourselves with 
                  should be as intentional as the way we live. We curate pieces that merge artisan 
                  craftsmanship with modern design sensibility.
                </p>
                <p>
                  Every item in our collection has been hand-selected — chosen for its quality, 
                  its story, and its ability to transform a space. We work directly with makers 
                  around the world who share our commitment to sustainability and excellence.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="img-reveal rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop&q=80"
                alt="Artisan at work"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#2C3B2D] py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ...stagger(i) }}
                  className="text-center"
                >
                  <p className="font-display text-4xl md:text-5xl font-medium text-[#C7956D] mb-2">
                    {stat.number}
                  </p>
                  <p className="text-xs text-[#FDFCFA]/50 tracking-[0.15em] uppercase">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
              What Guides Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D]">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ...stagger(i) }}
                  className="bg-[#F5F2ED] rounded-2xl p-8 group hover:bg-[#2C3B2D] transition-colors duration-500"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FDFCFA] flex items-center justify-center mb-5 group-hover:bg-[#C7956D]/20 transition-colors duration-500">
                    <Icon size={20} weight="light" className="text-[#C7956D]" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-[#2C3B2D] mb-2 group-hover:text-[#FDFCFA] transition-colors duration-500">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6B7C5E] leading-relaxed group-hover:text-[#FDFCFA]/60 transition-colors duration-500">
                    {value.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#F5F2ED] py-24">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D] mb-6">
                Ready to transform
                <br />
                <span className="italic">your space?</span>
              </h2>
              <p className="text-[#6B7C5E] text-base max-w-md mx-auto mb-8 leading-relaxed">
                Explore our curated collection and find pieces that speak to your style.
              </p>
              <Link href="/shop" className="btn-primary">
                Shop Now <ArrowRight size={14} weight="bold" />
              </Link>
            </motion.div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </div>
  )
}
