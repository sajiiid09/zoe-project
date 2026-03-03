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
import { fetchCatalogProduct, fetchCatalogProducts } from "@/lib/api"

export default function ProductPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const [product, setProduct] = useState<any | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadData() {
      if (!productId) return
      
      try {
        setLoading(true)
        const data = await fetchCatalogProduct(productId)
        
        const mappedProduct = {
          id: data.id,
          name: data.title,
          price: Number(data.retailPrice),
          image: data.images && data.images.length > 0 ? data.images[0] : "/placeholder.svg",
          category: data.category || "uncategorized",
          description: data.description
        }
        
        setProduct(mappedProduct)
        
        // Load related products
        const allProducts = await fetchCatalogProducts()
        const related = allProducts
          .filter((p: any) => p.category === data.category && p.id !== data.id)
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.title,
            price: Number(p.retailPrice),
            image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg"
          }))
          
        setRelatedProducts(related)
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Product not found")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
    window.scrollTo(0, 0)
  }, [productId])

  if (loading) {
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

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFA]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#6B7C5E] mb-4">{error || "Product not found"}</p>
          <Link href="/shop" className="text-[#C7956D] font-medium link-underline">
            Back to Shop
          </Link>
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
