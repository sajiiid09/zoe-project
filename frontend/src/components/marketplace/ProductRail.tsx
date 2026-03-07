import { ProductCard } from "@/components/marketplace/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProductCardModel } from "@/types/catalog";

export const ProductRail = ({
  title,
  subtitle,
  href,
  items,
}: {
  title: string;
  subtitle?: string;
  href: string;
  items: ProductCardModel[];
}) => (
  <section className="rail-section">
    <SectionHeader title={title} subtitle={subtitle} cta={{ label: "View all", href }} />
    <div className="rail-track">
      {items.map((item) => (
        <div key={item.id} className="rail-item">
          <ProductCard product={item} />
        </div>
      ))}
    </div>
  </section>
);
