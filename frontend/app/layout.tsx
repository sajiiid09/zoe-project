import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "Decormade — Curated Home Décor & Artisan Living",
  description:
    "Discover hand-selected decoration pieces crafted with intention. Sustainable materials, artisan quality, modern design.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
