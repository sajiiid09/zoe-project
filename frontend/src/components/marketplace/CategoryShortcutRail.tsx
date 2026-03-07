import Link from "next/link";

import { categoryItems } from "@/lib/config/site";

export const CategoryShortcutRail = () => (
  <section className="category-shortcuts" aria-label="Popular categories">
    {categoryItems.map((item) => (
      <Link key={item.slug} href={`/categories/${item.slug}`} className="category-shortcut-item">
        <span aria-hidden="true">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    ))}
  </section>
);
