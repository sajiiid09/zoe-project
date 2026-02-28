"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import ProductCard from "@/components/ProductCard"
import PageTransition from "@/components/PageTransition"
import { useCart } from "@/context/CartContext"

const ALL_PRODUCTS = [
  { id: 1, name: "Minimalist Vase", price: 45, image: "/minimalist-ceramic-vase.png", category: "vases" },
  { id: 2, name: "Wall Mirror", price: 89, image: "/modern-wall-mirror.jpg", category: "mirrors" },
  { id: 3, name: "Plant Pot", price: 32, image: "/ceramic-plant-pot.png", category: "pots" },
  { id: 4, name: "Candle Set", price: 28, image: "/luxury-scented-candles.jpg", category: "candles" },
  { id: 5, name: "Decorative Bowl", price: 55, image: "/decorative-ceramic-bowl.png", category: "bowls" },
  { id: 6, name: "Table Lamp", price: 75, image: "/modern-table-lamp.jpg", category: "lamps" },
  { id: 7, name: "Wall Art", price: 95, image: "/abstract-wall-art.png", category: "art" },
  { id: 8, name: "Throw Pillow", price: 38, image: "/decorative-throw-pillow.jpg", category: "pillows" },
  { id: 9, name: "Wooden Shelf", price: 120, image: "/wooden-floating-shelf.jpg", category: "shelves" },
  { id: 10, name: "Glass Vase", price: 52, image: "/clear-glass-vase.jpg", category: "vases" },
  { id: 11, name: "Ceramic Planter", price: 42, image: "/ceramic-planter-pot.jpg", category: "pots" },
  { id: 12, name: "Scented Candle", price: 35, image: "/luxury-scented-candle.jpg", category: "candles" },
]

export default function Shop() {
  const searchParams = useSearchParams()
  const { items, addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  const filteredProducts = useMemo(() => {
    let filtered = ALL_PRODUCTS

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [selectedCategory, priceRange, searchTerm, sortBy])

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NoticeBanner />
      <Header />

      <PageTransition>
        <div className="flex-1 max-w-6xl mx-auto w-full py-8 px-4 mt-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            Shop
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full lg:w-64 flex-shrink-0"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    {["vases", "mirrors", "pots", "candles", "bowls", "lamps", "art", "pillows", "shelves"].map(
                      (cat) => (
                        <label key={cat} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 capitalize">{cat}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              {/* Search and Sort */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </motion.select>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}
