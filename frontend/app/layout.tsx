import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { ClerkProvider } from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
