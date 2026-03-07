import { AppContainer } from "@/components/layout/AppContainer";
import { CategoryShortcutRail } from "@/components/marketplace/CategoryShortcutRail";
import { ProductRail } from "@/components/marketplace/ProductRail";
import { PromoBannerGrid } from "@/components/marketplace/PromoBannerGrid";
import { SearchAssist } from "@/components/marketplace/SearchAssist";
import { TrustStrip } from "@/components/marketplace/TrustStrip";
import { getHomepageRails, listLegacyProducts } from "@/lib/api/products";

export default async function HomePage() {
  const [homepageRails, picks] = await Promise.all([
    getHomepageRails(),
    listLegacyProducts({ pageSize: 12, sort: "relevance" }),
  ]);

  return (
    <AppContainer>
      <section className="hero-grid">
        <article className="hero-main">
          <p>15% cashback + Free delivery on your first order</p>
          <h1>BIG DEAL SALE<br />UP TO 60% OFF</h1>
          <a href="/search?sort=deals" className="hero-cta">Shop All Deals Now</a>
        </article>
      </section>

      <CategoryShortcutRail />
      <PromoBannerGrid />
      <TrustStrip />

      <ProductRail
        title="Recommended for you"
        subtitle="Picked based on high-demand marketplace trends"
        href="/search"
        items={picks.items.slice(0, 8)}
      />

      {homepageRails.map((rail) => (
        <ProductRail
          key={rail.title}
          title={rail.title}
          subtitle={rail.subtitle}
          href={rail.href}
          items={rail.items}
        />
      ))}

      <SearchAssist />
    </AppContainer>
  );
}
