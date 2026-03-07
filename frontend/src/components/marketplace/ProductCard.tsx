import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProductCardModel } from "@/types/catalog";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

export const ProductCard = ({ product }: { product: ProductCardModel }) => (
  <Card className="product-card">
    <Link href={`/product/${product.slug}`} className="product-link">
      <div className="product-image-wrap">
        <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 50vw, 220px" />
      </div>
      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-rating">★ {product.rating} ({product.reviewCount})</p>
        <div className="product-pricing">
          <strong>{money(product.price.amount, product.price.currency)}</strong>
          {product.compareAtPrice ? (
            <span>{money(product.compareAtPrice.amount, product.compareAtPrice.currency)}</span>
          ) : null}
        </div>
        {product.badge ? <Badge>{product.badge}</Badge> : null}
      </div>
    </Link>
  </Card>
);
