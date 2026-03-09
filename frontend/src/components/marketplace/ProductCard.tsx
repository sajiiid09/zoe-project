"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { useWishlist } from "@/components/commerce/WishlistProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProductCardModel } from "@/types/catalog";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const discountPct = (price: number, compareAt?: number) => {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
};

export const ProductCard = ({ product }: { product: ProductCardModel }) => {
  const discount = discountPct(product.price.amount, product.compareAtPrice?.amount);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
      className="product-card-motion"
    >
      <Card className="product-card polish-card">
        <Link href={`/product/${product.slug}`} className="product-link">
          <div className="product-image-wrap">
            <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 45vw, (max-width:1200px) 30vw, 220px" />
            <button
              type="button"
              aria-label="Add to wishlist"
              className={`wishlist-btn ${isWishlisted(product.id) ? "active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                toggleWishlist(product);
              }}
            >
              <Heart size={16} weight="bold" />
            </button>
            {discount ? <span className="deal-tag">-{discount}%</span> : null}
          </div>
          <div className="product-content">
            <p className="product-category">{product.category}</p>
            <h3>{product.title}</h3>
            <p className="product-rating">★ {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})</p>
            <div className="product-pricing">
              <strong>{money(product.price.amount, product.price.currency)}</strong>
              {product.compareAtPrice ? (
                <span>{money(product.compareAtPrice.amount, product.compareAtPrice.currency)}</span>
              ) : null}
            </div>
            <p className="delivery-line">{product.deliveryLabel ?? "Delivery in 2-4 days"}</p>
            {product.badge ? <Badge>{product.badge}</Badge> : null}
          </div>
        </Link>
        <div className="product-card-footer">
          {product.source === "legacy" ? (
            <AddToCartButton product={product as ProductCardModel & { source: "legacy" }} />
          ) : (
            <Link href={`/catalog/${product.id}`} className="btn btn-secondary btn-sm" style={{width: "100%", justifyContent: "center", display: "flex"}}>
              View Details
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
