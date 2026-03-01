"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { CaretRight } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"
import ProductDetails from "@/components/ProductDetails"
import ProductDescription from "@/components/ProductDescription"
import { useCart } from "@/context/CartContext"

const ALL_PRODUCTS = [
  { id: 1, name: "Minimalist Vase", price: 45, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=1000&fit=crop&q=80", category: "vases", description: "A beautifully crafted minimalist ceramic vase perfect for modern interiors. Its clean lines and neutral tone complement any décor." },
  { id: 2, name: "Wall Mirror", price: 89, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop&q=80", category: "mirrors", description: "Elegant wall mirror with a sleek frame design. Perfect for adding depth and light to your living spaces." },
  { id: 3, name: "Plant Pot", price: 32, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=1000&fit=crop&q=80", category: "pots", description: "Handcrafted ceramic plant pot with drainage holes. Ideal for indoor plants and succulents." },
  { id: 4, name: "Candle Set", price: 28, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&h=1000&fit=crop&q=80", category: "candles", description: "Set of luxury scented candles made with natural wax. Creates a warm, inviting ambiance in any room." },
  { id: 5, name: "Decorative Bowl", price: 55, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=1000&fit=crop&q=80", category: "bowls", description: "Artisan decorative bowl with intricate patterns. Perfect as a centerpiece or functional decor item." },
  { id: 6, name: "Table Lamp", price: 75, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop&q=80", category: "lamps", description: "Modern table lamp with adjustable brightness. Combines style with functionality for your workspace." },
  { id: 7, name: "Wall Art", price: 95, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=1000&fit=crop&q=80", category: "art", description: "Abstract wall art piece in contemporary style. Makes a bold statement in any interior design." },
  { id: 8, name: "Throw Pillow", price: 38, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=1000&fit=crop&q=80", category: "pillows", description: "Soft and comfortable throw pillow with premium fabric. Adds color and texture to your seating." },
  { id: 9, name: "Wooden Shelf", price: 120, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=1000&fit=crop&q=80", category: "shelves", description: "Floating wooden shelf made from sustainably sourced wood. Provides stylish storage and display." },
  { id: 10, name: "Glass Vase", price: 52, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=1000&fit=crop&q=80", category: "vases", description: "Crystal clear glass vase suitable for fresh or dried flowers. A timeless decorative piece." },
  { id: 11, name: "Ceramic Planter", price: 42, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=1000&fit=crop&q=80", category: "pots", description: "Spacious ceramic planter with modern design. Perfect for larger indoor or outdoor plants." },
  { id: 12, name: "Scented Candle", price: 35, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=1000&fit=crop&q=80", category: "candles", description: "Single luxury scented candle with long-lasting fragrance. Creates a peaceful atmosphere." },
]

export default function ProductPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const [product, setProduct] = useState<(typeof ALL_PRODUCTS)[number] | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const found = ALL_PRODUCTS.find((p) => p.id === Number(productId))
    if (found) setProduct(found)
    window.scrollTo(0, 0)
  }, [productId])

  const relatedProducts = product
    ? ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : []

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#3D5A3E] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />

      <PageTransition>
        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-10">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs text-[#B8BCA0] mb-10"
          >
            <Link href="/shop" className="hover:text-[#2C3B2D] transition-colors">Shop</Link>
            <CaretRight size={10} weight="bold" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-[#2C3B2D] transition-colors capitalize">
              {product.category}
            </Link>
            <CaretRight size={10} weight="bold" />
            <span className="text-[#2C3B2D] font-medium">{product.name}</span>
          </motion.nav>

          <ProductDetails product={product} onAddToCart={() => addToCart(product)} />
          <ProductDescription product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="border-t border-[#E8E3DA] pt-16 mt-8 mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-medium text-[#2C3B2D] mb-8">
                You may also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/shop/${p.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2ED] mb-3">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-[#2C3B2D] group-hover:text-[#C7956D] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-[#6B7C5E] mt-0.5">${p.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}
