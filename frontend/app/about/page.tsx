"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Leaf, Palette, HandHeart, ShieldCheck } from "@phosphor-icons/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"

const values = [
  { title: "Quality", desc: "We source only the finest materials and work with skilled artisans.", icon: ShieldCheck },
  { title: "Sustainability", desc: "We are committed to environmentally responsible practices.", icon: Leaf },
  { title: "Design", desc: "Every piece is carefully curated to complement modern living spaces.", icon: Palette },
  { title: "Customer Service", desc: "Your satisfaction is our top priority.", icon: HandHeart },
]

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      <PageTransition>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=600&fit=crop&q=80"
            alt="About Decormade"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#3F4E40]/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center text-white px-4"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">About Decormade</h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto">
                Bringing elegance and sophistication to every home since 2018.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-4xl mx-auto px-4 py-20">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-16">
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold text-[#3F4E40] mb-4">Our Story</h2>
              <p className="text-[#546A50] leading-relaxed max-w-2xl mx-auto">
                Decormade was founded with a simple mission: to bring elegance and sophistication to every home. We
                believe that beautiful decoration pieces should be accessible to everyone, and that quality
                craftsmanship should never be compromised.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-[#3F4E40] mb-8 text-center">Our Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-[#E5E0D8] rounded-2xl p-6 flex items-start gap-4"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#F5F3F0] flex items-center justify-center flex-shrink-0">
                        <Icon size={22} weight="bold" className="text-[#546A50]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3F4E40] mb-1">{value.title}</h3>
                        <p className="text-sm text-[#B5B89B] leading-relaxed">{value.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold text-[#3F4E40] mb-4">Why Choose Us?</h2>
              <p className="text-[#546A50] leading-relaxed max-w-2xl mx-auto">
                With over a decade of experience in the home decoration industry, we have built a reputation for
                excellence. Our curated collection features pieces from talented designers and artisans around the
                world. We stand behind every product we sell with our satisfaction guarantee.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </PageTransition>
      <Footer />
    </div>
  )
}
