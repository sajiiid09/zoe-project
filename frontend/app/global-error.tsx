"use client"

import { CartProvider } from "@/context/CartContext"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <CartProvider>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </CartProvider>
      </body>
    </html>
  )
}
