import { ProductCard } from "@/components/marketplace/ProductCard";
import { AppContainer } from "@/components/layout/AppContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { listLegacyProducts } from "@/lib/api/products";

export default async function HomePage() {
  const products = await listLegacyProducts();

  return (
    <AppContainer>
      <section className="hero-grid">
        <article className="hero-main">
          <p>Fast delivery • Trusted sellers • Daily deals</p>
          <h1>Everything you need, from local essentials to top tech brands.</h1>
        </article>
        <article className="hero-side">Free shipping over $50 this week</article>
      </section>

      <Tabs items={[{ label: "Trending", active: true }, { label: "Best Sellers" }, { label: "New Arrivals" }]} />

      <section>
        <SectionHeader title="Top picks for you" subtitle="Personalized for large-catalog discovery" cta={{ href: "/search", label: "View all" }} />
        <div className="product-grid">
          {products.items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </AppContainer>
  );
}
