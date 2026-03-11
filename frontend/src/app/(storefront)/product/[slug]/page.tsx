import Image from "next/image";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { AppContainer } from "@/components/layout/AppContainer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getLegacyProductBySlug, listLegacyProducts } from "@/lib/api/products";
import type { ProductCardModel } from "@/types/catalog";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentResult = await getLegacyProductBySlug(slug);
  const current = currentResult.product;
  const relatedList = await listLegacyProducts({
    category: current?.category,
    sort: "rating",
    pageSize: 12,
  });
  const productApiError = currentResult.error || relatedList.error;
  const related = relatedList.items.filter((item) => item.slug !== slug).slice(0, 4);

  return (
    <AppContainer>
      <PageIntro
        title={current?.title ?? "Product Detail"}
        description={current ? "Preview route with related products and retail layout hooks." : "Product detail route scaffold."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Product" }]}
      />

      {productApiError ? (
        <EmptyState
          title="Product service unavailable"
          description={productApiError.message}
        />
      ) : current ? (
        <section className="pdp-preview polished-pdp">
          {/* Column 1: Image */}
          <div className="pdp-image-box polish-card">
            <Image src={current.image} alt={current.title} fill sizes="(max-width: 768px) 95vw, 400px" />
          </div>

          {/* Column 2: Details */}
          <div className="pdp-info-box">
            <p className="pdp-brand">{current.category}</p>
            <h1 className="pdp-title">{current.title}</h1>
            <p className="product-rating">★ {current.rating.toFixed(1)} ({current.reviewCount})</p>
            
            <div className="pdp-price-wrap">
              <span className="pdp-price-label">Now:</span>
              <span className="pdp-price"><span className="pdp-price-currency">$</span>{current.price.amount}</span>
            </div>
            <p className="delivery-line mt-2 text-sm text-green-700 font-bold bg-green-50 w-fit px-2 py-1 rounded">
              {current.deliveryLabel}
            </p>
          </div>

          {/* Column 3: Action Sidebar */}
          <div className="pdp-action-box polish-card">
            <div className="trust-signal">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-sm">🚚</div>
              <div>
                <h4>Free Delivery</h4>
                <p>on eligible items</p>
              </div>
            </div>
            <div className="trust-signal">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-sm">🛡️</div>
              <div>
                <h4>Secure Shopping</h4>
                <p>Your data is protected</p>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-100 mt-2">
              <div className="flex gap-2">
                 <AddToCartButton product={current as unknown as ProductCardModel & { source: "legacy" }} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <EmptyState
          title="Product not found"
          description="The requested product is not available."
        />
      )}

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
