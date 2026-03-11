import { AppContainer } from "@/components/layout/AppContainer";
import { CategoryShortcutRail } from "@/components/marketplace/CategoryShortcutRail";
import { ProductRail } from "@/components/marketplace/ProductRail";
import { PromoBannerGrid } from "@/components/marketplace/PromoBannerGrid";
import { SearchAssist } from "@/components/marketplace/SearchAssist";
import { TrustStrip } from "@/components/marketplace/TrustStrip";
import { EmptyState } from "@/components/state/EmptyState";
import { getHomepageRails, listLegacyProducts } from "@/lib/api/products";
import { HeroSection } from "@/components/storefront/HeroSection";

export default async function HomePage() {
  const [homepageRailsResult, picks] = await Promise.all([
    getHomepageRails(),
    listLegacyProducts({ pageSize: 12, sort: "relevance" }),
  ]);
  const productApiError = picks.error || homepageRailsResult.error;

  return (
    <AppContainer>
      <HeroSection />

      <CategoryShortcutRail />
      <PromoBannerGrid />
      <TrustStrip />

      {productApiError ? (
        <EmptyState
          title="Product service unavailable"
          description={productApiError.message}
        />
      ) : (
        <>
          <ProductRail
            title="Recommended for you"
            subtitle="Picked based on high-demand marketplace trends"
            href="/search"
            items={picks.items.slice(0, 8)}
          />

          {homepageRailsResult.rails.map((rail) => (
            <ProductRail
              key={rail.title}
              title={rail.title}
              subtitle={rail.subtitle}
              href={rail.href}
              items={rail.items}
            />
          ))}
        </>
      )}

      <SearchAssist />
    </AppContainer>
  );
}
