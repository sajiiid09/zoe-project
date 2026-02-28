import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "Decormade - Modern Decoration Store",
  description: "Discover elegant home decoration pieces",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
