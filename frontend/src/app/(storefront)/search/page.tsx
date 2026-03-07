import { AppContainer } from "@/components/layout/AppContainer";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { ListingToolbar } from "@/components/marketplace/ListingToolbar";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SearchAssist } from "@/components/marketplace/SearchAssist";
import { EmptyState } from "@/components/state/EmptyState";
import { PageIntro } from "@/components/layout/PageIntro";
import { listLegacyProducts } from "@/lib/api/products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: "relevance" | "deals" | "rating" | "price_asc" | "price_desc" | "new"; minRating?: string; page?: string }>;
}) {
  const params = await searchParams;
  const products = await listLegacyProducts({
    q: params.q,
    category: params.category,
    sort: params.sort,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: 16,
  });

  return (
    <AppContainer>
      <PageIntro
        title="Search Results"
        description="Find products quickly with practical filters, sorting, and category-led discovery."
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <div className="listing-layout">
        <div className="listing-sidebar desktop-only"><FilterSidebar q={params.q} /></div>
        <main>
          <div className="listing-actions-row">
            <MobileFilterDrawer q={params.q} />
            <ListingToolbar total={products.total} query={params.q} category={params.category} isSearch />
          </div>

          {products.items.length ? (
            <div className="listing-grid">
              {products.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              description="Try adjusting search keywords, removing filters, or browsing by category."
              action="Clear filters"
            />
          )}

          <SearchAssist />
        </main>
      </div>
    </AppContainer>
  );
}
