"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import PageTransition from "@/components/PageTransition"
import { useCart } from "@/context/CartContext"
import { Funnel, MagnifyingGlass, X, SlidersHorizontal } from "@phosphor-icons/react"

const ALL_PRODUCTS = [
  { id: 1, name: "Minimalist Vase", price: 45, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&h=600&fit=crop&q=80", category: "vases" },
  { id: 2, name: "Wall Mirror", price: 89, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&h=600&fit=crop&q=80", category: "mirrors" },
  { id: 3, name: "Plant Pot", price: 32, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=600&fit=crop&q=80", category: "pots" },
  { id: 4, name: "Candle Set", price: 28, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500&h=600&fit=crop&q=80", category: "candles" },
  { id: 5, name: "Decorative Bowl", price: 55, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=600&fit=crop&q=80", category: "bowls" },
  { id: 6, name: "Table Lamp", price: 75, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=600&fit=crop&q=80", category: "lamps" },
  { id: 7, name: "Wall Art", price: 95, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500&h=600&fit=crop&q=80", category: "art" },
  { id: 8, name: "Throw Pillow", price: 38, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=600&fit=crop&q=80", category: "pillows" },
  { id: 9, name: "Wooden Shelf", price: 120, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=500&h=600&fit=crop&q=80", category: "shelves" },
  { id: 10, name: "Glass Vase", price: 52, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=600&fit=crop&q=80", category: "vases" },
  { id: 11, name: "Ceramic Planter", price: 42, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=600&fit=crop&q=80", category: "pots" },
  { id: 12, name: "Scented Candle", price: 35, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&h=600&fit=crop&q=80", category: "candles" },
]

const CATEGORIES = ["vases", "mirrors", "pots", "candles", "bowls", "lamps", "art", "pillows", "shelves"]

export default function Shop() {
  const searchParams = useSearchParams()
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = [...ALL_PRODUCTS]
    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory)
    if (searchTerm) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price)
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name))
    return filtered
  }, [selectedCategory, priceRange, searchTerm, sortBy])

  const handleAddToCart = (product: any) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
      <Header />

      <PageTransition>
        {/* Hero Banner */}
        <section className="bg-[#F5F2ED] pt-10 pb-14 px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#C7956D] text-[11px] tracking-[0.25em] uppercase font-medium mb-3"
            >
              Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-medium text-[#2C3B2D] mb-3"
            >
              Shop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#6B7C5E] max-w-md"
            >
              Discover our curated collection of artisan home décor pieces, each crafted with care.
            </motion.p>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-10">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <MagnifyingGlass size={16} weight="light" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8BCA0]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-[#E8E3DA] text-sm font-body text-[#2C3B2D] placeholder-[#B8BCA0] focus:outline-none focus:border-[#3D5A3E] transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter Toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-[#2C3B2D]/60 hover:text-[#2C3B2D] transition-colors lg:hidden"
              >
                <SlidersHorizontal size={16} weight="light" />
                Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-[#2C3B2D]/70 bg-transparent border-b border-[#E8E3DA] py-2 px-1 focus:outline-none focus:border-[#3D5A3E] transition-colors font-body cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name">Alphabetical</option>
              </select>

              {/* Results Count */}
              <span className="text-xs text-[#B8BCA0] hidden md:inline">
                {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex gap-12">
            {/* Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`w-52 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}
            >
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B8BCA0] mb-4">
                  Category
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block w-full text-left py-1.5 text-sm transition-colors ${
                      !selectedCategory ? "text-[#2C3B2D] font-medium" : "text-[#6B7C5E] hover:text-[#2C3B2D]"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                      className={`block w-full text-left py-1.5 text-sm capitalize transition-colors ${
                        selectedCategory === cat
                          ? "text-[#2C3B2D] font-medium"
                          : "text-[#6B7C5E] hover:text-[#2C3B2D]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B8BCA0] mb-4">
                  Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number.parseInt(e.target.value)])}
                  className="w-full accent-[#3D5A3E] h-0.5"
                />
                <div className="flex justify-between text-xs text-[#B8BCA0] mt-2">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Active Filters */}
              {selectedCategory && (
                <div className="mb-6">
                  <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B8BCA0] mb-3">
                    Active
                  </h3>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2ED] rounded-full text-xs text-[#2C3B2D] capitalize hover:bg-[#E8E3DA] transition-colors"
                  >
                    {selectedCategory} <X size={10} weight="bold" />
                  </button>
                </div>
              )}
            </motion.aside>

            {/* Product Grid */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {filteredProducts.length > 0 ? (
                  <motion.div
                    key={`grid-${selectedCategory}-${sortBy}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
                  >
                    {filteredProducts.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        index={i}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <Funnel size={40} weight="thin" className="text-[#E8E3DA] mb-4" />
                    <p className="text-[#6B7C5E] text-sm mb-2">No products match your filters</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("")
                        setSearchTerm("")
                        setPriceRange([0, 150])
                      }}
                      className="text-[#C7956D] text-sm font-medium link-underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}
