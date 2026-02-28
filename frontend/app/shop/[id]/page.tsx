"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import PageTransition from "@/components/PageTransition"
import ProductDetails from "@/components/ProductDetails"
import ProductDescription from "@/components/ProductDescription"
import { useCart } from "@/context/CartContext"

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Vase",
    price: 45,
    image: "/minimalist-ceramic-vase.png",
    category: "vases",
    description:
      "A beautifully crafted minimalist ceramic vase perfect for modern interiors. Its clean lines and neutral tone complement any décor.",
  },
  {
    id: 2,
    name: "Wall Mirror",
    price: 89,
    image: "/modern-wall-mirror.jpg",
    category: "mirrors",
    description:
      "Elegant wall mirror with a sleek frame design. Perfect for adding depth and light to your living spaces.",
  },
  {
    id: 3,
    name: "Plant Pot",
    price: 32,
    image: "/ceramic-plant-pot.png",
    category: "pots",
    description: "Handcrafted ceramic plant pot with drainage holes. Ideal for indoor plants and succulents.",
  },
  {
    id: 4,
    name: "Candle Set",
    price: 28,
    image: "/luxury-scented-candles.jpg",
    category: "candles",
    description: "Set of luxury scented candles made with natural wax. Creates a warm, inviting ambiance in any room.",
  },
  {
    id: 5,
    name: "Decorative Bowl",
    price: 55,
    image: "/decorative-ceramic-bowl.png",
    category: "bowls",
    description: "Artisan decorative bowl with intricate patterns. Perfect as a centerpiece or functional decor item.",
  },
  {
    id: 6,
    name: "Table Lamp",
    price: 75,
    image: "/modern-table-lamp.jpg",
    category: "lamps",
    description: "Modern table lamp with adjustable brightness. Combines style with functionality for your workspace.",
  },
  {
    id: 7,
    name: "Wall Art",
    price: 95,
    image: "/abstract-wall-art.png",
    category: "art",
    description: "Abstract wall art piece in contemporary style. Makes a bold statement in any interior design.",
  },
  {
    id: 8,
    name: "Throw Pillow",
    price: 38,
    image: "/decorative-throw-pillow.jpg",
    category: "pillows",
    description: "Soft and comfortable throw pillow with premium fabric. Adds color and texture to your seating.",
  },
  {
    id: 9,
    name: "Wooden Shelf",
    price: 120,
    image: "/wooden-floating-shelf.jpg",
    category: "shelves",
    description: "Floating wooden shelf made from sustainably sourced wood. Provides stylish storage and display.",
  },
  {
    id: 10,
    name: "Glass Vase",
    price: 52,
    image: "/clear-glass-vase.jpg",
    category: "vases",
    description: "Crystal clear glass vase suitable for fresh or dried flowers. A timeless decorative piece.",
  },
  {
    id: 11,
    name: "Ceramic Planter",
    price: 42,
    image: "/ceramic-planter-pot.jpg",
    category: "pots",
    description: "Spacious ceramic planter with modern design. Perfect for larger indoor or outdoor plants.",
  },
  {
    id: 12,
    name: "Scented Candle",
    price: 35,
    image: "/luxury-scented-candle.jpg",
    category: "candles",
    description: "Single luxury scented candle with long-lasting fragrance. Creates a peaceful atmosphere.",
  },
]

export default function ProductPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const [product, setProduct] = useState<any>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const foundProduct = ALL_PRODUCTS.find((p) => p.id === Number(productId))
    if (foundProduct) {
      setProduct(foundProduct)
    }
    window.scrollTo(0, 0)
  }, [productId])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NoticeBanner />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NoticeBanner />
      <Header />

      <PageTransition>
        <div className="max-w-7xl mx-auto w-full px-4 py-8 mt-16">
          {/* Breadcrumbs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-sm mb-8">
            <a href="/shop" className="hover:text-gray-900 transition">
              Shop
            </a>{" "}
            /{" "}
            <a href={`/shop?category=${product.category}`} className="hover:text-gray-900 transition">
              {product.category}
            </a>{" "}
            / <span className="text-gray-900">{product.name}</span>
          </motion.div>

          {/* Product Details */}
          {product && <ProductDetails product={product} onAddToCart={() => addToCart(product)} />}

          {/* Description & Reviews */}
          {product && <ProductDescription product={product} />}
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}
