import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { AppContainer } from "@/components/layout/AppContainer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listLegacyProducts } from "@/lib/api/products";
import type { ProductCardModel } from "@/types/catalog";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await listLegacyProducts({ pageSize: 30 });
  const current = all.items.find((item) => item.slug === slug);
  const related = all.items.filter((item) => item.slug !== slug).slice(0, 4);

  return (
    <AppContainer>
      <PageIntro
        title={current?.title ?? "Product Detail"}
        description={current ? "Preview route with related products and retail layout hooks." : "Product detail route scaffold."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Product" }]}
      />

      {current ? (
        <section className="pdp-preview">
          <div className="pdp-image-box">
            <Image src={current.image} alt={current.title} fill sizes="(max-width: 768px) 95vw, 520px" />
          </div>
          <div className="pdp-meta-box">
            <p className="product-category">{current.category}</p>
            <h2>{current.title}</h2>
            <p className="product-rating">★ {current.rating.toFixed(1)} ({current.reviewCount}) reviews</p>
            <p className="pdp-price">${current.price.amount}</p>
            <p className="delivery-line">{current.deliveryLabel}</p>
            <div className="pdp-actions"><AddToCartButton product={current as unknown as ProductCardModel & { source: "legacy" }} /><Link href="/checkout" className="checkout-link-btn">Buy now</Link></div>
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeader title="Similar picks" subtitle="Customers also viewed" cta={{ label: "View more", href: "/search" }} />
        <div className="listing-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </AppContainer>
  );
}
