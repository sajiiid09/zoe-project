"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/commerce/CartProvider";
import { OrderSummary } from "@/components/commerce/OrderSummary";
import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQty, removeItem, pricing } = useCart();

  return (
    <AppContainer>
      <PageIntro title="Cart" description="Review your selected items before checkout." crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      {!items.length ? (
        <section className="state-box">
          <h2>Your cart is empty</h2>
          <p>Add products to continue with a secure checkout.</p>
          <Link href="/search" className="hero-cta">Start shopping</Link>
        </section>
      ) : (
        <section className="purchase-layout">
          <div className="cart-lines">
            {items.map((item) => (
              <article key={item.product.id} className="cart-line">
                <div className="cart-thumb">
                  <Image src={item.product.image} alt={item.product.title} fill sizes="120px" />
                </div>
                <div>
                  <h3>{item.product.title}</h3>
                  <p>{item.product.category}</p>
                  <p className="cart-price">${item.product.price.amount.toFixed(2)}</p>
                </div>
                <div className="cart-controls">
                  <label>
                    Qty
                    <select value={item.quantity} onChange={(e) => updateQty(item.product.id, Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map((qty) => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.product.id)}>Remove</Button>
                </div>
              </article>
            ))}
          </div>

          <OrderSummary
            pricing={pricing}
            cta={<Link href="/checkout" className="checkout-link-btn">Proceed to checkout</Link>}
          />
        </section>
      )}
    </AppContainer>
  );
}
