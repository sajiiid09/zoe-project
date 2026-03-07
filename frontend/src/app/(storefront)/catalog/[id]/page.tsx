import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { getCatalogEntity } from "@/lib/api/catalog";

export default async function CatalogEntityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await getCatalogEntity(id);

  if (!current) {
    notFound();
  }

  return (
    <AppContainer>
      <PageIntro
        title={current.title}
        description={"Catalog Preview Route."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Catalog" }]}
      />

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
          
          <div className="mt-6 mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-blue-800 text-sm mb-1">Catalog Item</h3>
            <p className="text-sm text-blue-700">
              This item is part of the newer marketplace catalog and is not currently available for direct purchase through the storefront.
            </p>
          </div>
          
          <div className="pdp-actions">
            <Link href="/" className="btn btn-secondary">Back to Store</Link>
          </div>
        </div>
      </section>
    </AppContainer>
  );
}
