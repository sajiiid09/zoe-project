"use client";

import Link from "next/link";

import { useCart } from "@/components/commerce/CartProvider";
import { useWishlist } from "@/components/commerce/WishlistProvider";
import { AppContainer } from "@/components/layout/AppContainer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { items, removeWishlisted } = useWishlist();
  const { addItem } = useCart();

  return (
    <AppContainer>
      <PageIntro title="Wishlist" description="Keep track of products you love and return anytime." crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

      {!items.length ? (
        <section className="state-box">
          <h2>Your wishlist is empty</h2>
          <p>Save products while browsing so you can compare and buy later.</p>
          <Link href="/search" className="hero-cta">Explore products</Link>
        </section>
      ) : (
        <>
          <div className="listing-grid">
            {items.map((item) => (
              <div key={item.id} className="wishlist-item">
                <ProductCard product={item} />
                <div className="wishlist-actions">
                  <Button size="sm" onClick={() => addItem(item)}>Move to cart</Button>
                  <Button size="sm" variant="ghost" onClick={() => removeWishlisted(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppContainer>
  );
}
