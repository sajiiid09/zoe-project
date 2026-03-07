import Link from "next/link";

import { categoryItems } from "@/lib/config/site";

export const CategoryShortcutRail = () => (
  <section className="category-shortcuts" aria-label="Popular categories">
    {categoryItems.map((item) => (
      <Link key={item.slug} href={`/categories/${item.slug}`} className="category-shortcut-item">
        <div className="category-shortcut-icon" aria-hidden="true">{item.icon}</div>
        <span>{item.label}</span>
      </Link>
    ))}
  </section>
);
