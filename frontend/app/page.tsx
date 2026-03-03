"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, Leaf, Truck, ArrowsClockwise, Star } from "@phosphor-icons/react"
import { fetchCatalogProducts } from "@/lib/api"

const COLLECTIONS = [
  {
    name: "Ceramic Artistry",
    desc: "Handcrafted vessels & vases",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80",
    href: "/shop?category=vases",
  },
  {
    name: "Warm Lighting",
    desc: "Ambient table & pendant lamps",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80",
    href: "/shop?category=lamps",
  },
  {
    name: "Scented Living",
    desc: "Natural wax candles & diffusers",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&h=1000&fit=crop&q=80",
    href: "/shop?category=candles",
  },
]

const MARQUEE_TEXT = "Artisan Crafted  ·  Sustainably Sourced  ·  Modern Design  ·  Premium Quality  ·  Earth Friendly  ·  Hand Selected  ·  "

function stagger(i: number, base = 0.1) {
  return { delay: base + i * 0.08 }
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await fetchCatalogProducts()
        const mapped = data.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.title,
          price: Number(p.retailPrice),
          image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg",
        }))
        setFeaturedProducts(mapped)
      } catch (err) {
        console.error("Error loading featured products:", err)
      }
    }
    loadFeatured()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <NoticeBanner />
      <Header />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[600px] flex items-end overflow-hidden grain-overlay"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&h=1200&fit=crop&q=85"
            alt="Modern interior with curated decor"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C3B2D]/70 via-[#2C3B2D]/20 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 md:pb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#FDFCFA]/60 text-[11px] tracking-[0.25em] uppercase font-medium mb-4"
          >
            Curated Home Décor
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.05] text-[#FDFCFA] max-w-3xl mb-6"
          >
            Where design
            <br />
            meets <span className="italic text-[#C7956D]">intention</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-[#FDFCFA]/70 text-base md:text-lg max-w-lg mb-8 leading-relaxed"
          >
            Hand-selected pieces crafted with sustainable materials. 
            Elevate your space with objects that tell a story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop" className="btn-primary bg-[#FDFCFA] !text-[#2C3B2D] hover:!bg-[#C7956D] hover:!text-[#FDFCFA]">
              Shop Collection
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link href="/about" className="btn-outline !border-[#FDFCFA]/30 !text-[#FDFCFA] hover:!bg-[#FDFCFA] hover:!text-[#2C3B2D]">
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="py-5 border-y border-[#E8E3DA] overflow-hidden bg-[#FDFCFA]">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="font-display text-lg md:text-xl italic text-[#2C3B2D]/20 tracking-wide mx-0"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* PHILOSOPHY */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="img-reveal rounded-2xl overflow-hidden aspect-[4/5]"
          >
            <Image
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop&q=80"
              alt="Curated interior design"
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-4">
              Our Philosophy
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-[#2C3B2D] leading-[1.1] mb-6">
              Crafted with
              <br />
              <span className="italic">purpose</span>
            </h2>
            <p className="text-[#6B7C5E] text-base leading-[1.8] mb-6 max-w-lg">
              Each product is thoughtfully designed and created using sustainable materials 
              sourced directly from nature. We believe that beauty and responsibility can 
              coexist — in every piece we curate.
            </p>
            <p className="text-[#6B7C5E] text-base leading-[1.8] mb-8 max-w-lg">
              From small-batch ceramics to hand-poured candles, every item in our collection 
              carries the mark of its maker.
            </p>
            <Link href="/shop" className="btn-primary">
              Explore Collection
              <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="bg-[#F5F2ED] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
                Curated
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D]">
                Our Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="link-underline text-[#2C3B2D]/60 text-sm font-medium flex items-center gap-1 hover:text-[#2C3B2D] transition-colors"
            >
              View all <ArrowRight size={12} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((col, i) => (
              <motion.div
                key={col.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ...stagger(i) }}
              >
                <Link href={col.href} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C3B2D]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[#FDFCFA] text-xs font-medium tracking-[0.1em] uppercase flex items-center gap-1">
                        Explore <ArrowRight size={10} weight="bold" />
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-medium text-[#2C3B2D] mb-1">
                    {col.name}
                  </h3>
                  <p className="text-sm text-[#6B7C5E]">{col.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PIECES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
              Best Sellers
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-[#2C3B2D]">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-underline text-[#2C3B2D]/60 text-sm font-medium flex items-center gap-1 hover:text-[#2C3B2D] transition-colors"
          >
            Shop all <ArrowRight size={12} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ...stagger(i) }}
              >
                <Link href={`/shop/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2ED] mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-[#2C3B2D] group-hover:text-[#C7956D] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#6B7C5E] mt-0.5">${product.price}</p>
                </Link>
              </motion.div>
            ))
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#F5F2ED] rounded-xl mb-3" />
                <div className="h-4 bg-[#F5F2ED] rounded w-3/4" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* PARALLAX */}
      <section className="relative py-36 md:py-44 overflow-hidden grain-overlay">
        <Image
          src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1800&h=900&fit=crop&q=80"
          alt="Botanical lifestyle"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#2C3B2D]/60" />
        <div className="relative z-20 max-w-3xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-4">
              Community
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-[#FDFCFA] leading-[1.1] mb-6">
              Join the movement toward
              <br />
              <span className="italic">intentional living</span>
            </h2>
            <p className="text-[#FDFCFA]/70 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              Be part of a community that values quality, sustainability, and style. 
              Together, we&apos;re making spaces that matter.
            </p>
            <Link href="/shop" className="btn-primary bg-[#FDFCFA] !text-[#2C3B2D] hover:!bg-[#C7956D] hover:!text-[#FDFCFA]">
              Start Shopping
              <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BADGES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            {
              icon: Leaf,
              title: "Sustainably Sourced",
              desc: "Every material is responsibly sourced with minimal environmental impact.",
            },
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "Complimentary shipping on all orders over $100, delivered with care.",
            },
            {
              icon: ArrowsClockwise,
              title: "30-Day Returns",
              desc: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ...stagger(i) }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F2ED] mb-4">
                <item.icon size={22} weight="light" className="text-[#C7956D]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[#2C3B2D] mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B7C5E] max-w-xs mx-auto leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
