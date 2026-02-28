"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NoticeBanner from "@/components/NoticeBanner"
import PageTransition from "@/components/PageTransition"

export default function About() {
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
      <Header cartCount={0} />

      <PageTransition>
        <div className="flex-1 max-w-4xl mx-auto w-full py-16 px-4 mt-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            About Decormade
          </motion.h1>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                Decormade was founded with a simple mission: to bring elegance and sophistication to every home. We
                believe that beautiful decoration pieces should be accessible to everyone, and that quality
                craftsmanship should never be compromised.
              </p>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <ul className="space-y-3 text-gray-700">
                {[
                  { title: "Quality", desc: "We source only the finest materials and work with skilled artisans." },
                  { title: "Sustainability", desc: "We are committed to environmentally responsible practices." },
                  { title: "Design", desc: "Every piece is carefully curated to complement modern living spaces." },
                  { title: "Customer Service", desc: "Your satisfaction is our top priority." },
                ].map((value, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start"
                  >
                    <span className="font-semibold mr-3">{value.title}:</span>
                    <span>{value.desc}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-gray-700 leading-relaxed">
                With over a decade of experience in the home decoration industry, we have built a reputation for
                excellence. Our curated collection features pieces from talented designers and artisans around the
                world. We stand behind every product we sell with our satisfaction guarantee.
              </p>
            </motion.section>
          </motion.div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}
