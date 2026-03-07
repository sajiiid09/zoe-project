import Link from "next/link";

import { homepagePromos } from "@/lib/config/site";

export const PromoBannerGrid = () => (
  <section className="promo-grid" aria-label="Featured promotions">
    {homepagePromos.map((promo) => (
      <Link key={promo.title} href={promo.href} className={`promo-card promo-${promo.tone}`}>
        <p>{promo.title}</p>
        <h3>{promo.description}</h3>
        <span>Shop now</span>
      </Link>
    ))}
  </section>
);
