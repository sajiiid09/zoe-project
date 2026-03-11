import { notFound } from "next/navigation";

import { AppContainer } from "@/components/layout/AppContainer";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { ListingToolbar } from "@/components/marketplace/ListingToolbar";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { EmptyState } from "@/components/state/EmptyState";
import { PageIntro } from "@/components/layout/PageIntro";
import { listLegacyProducts } from "@/lib/api/products";
import { categoryItems } from "@/lib/config/site";

export default async function CategoryListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: "relevance" | "deals" | "rating" | "price_asc" | "price_desc" | "new"; minRating?: string; q?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const category = categoryItems.find((item) => item.slug === slug);
  if (!category) notFound();

  const products = await listLegacyProducts({
    category: slug,
    q: query.q,
    sort: query.sort,
    minRating: query.minRating ? Number(query.minRating) : undefined,
    pageSize: 20,
  });

  return (
    <AppContainer>
      <PageIntro
        title={category.label}
        description={`Explore ${category.label.toLowerCase()} deals, best sellers, and latest arrivals.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.label }]}
      />
      <div className="listing-layout">
        <div className="listing-sidebar desktop-only"><FilterSidebar q={query.q} /></div>
        <main>
          <div className="listing-actions-row">
            <MobileFilterDrawer q={query.q} />
            <ListingToolbar total={products.total} category={slug} query={query.q} />
          </div>
          {products.error ? (
            <EmptyState
              title="Product service unavailable"
              description={products.error.message}
            />
          ) : products.items.length ? (
            <div className="listing-grid">
              {products.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products in this category yet"
              description="Try a different filter or browse all categories."
              action="Browse all categories"
            />
          )}
        </main>
      </div>
    </AppContainer>
  );
}
