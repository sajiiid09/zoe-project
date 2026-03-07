import Link from "next/link";

import { categoryItems } from "@/lib/config/site";

export const FilterSidebar = ({ q }: { q?: string }) => {
  const baseParams = (extra: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    return `/search?${params.toString()}`;
  };

  return (
    <aside className="filter-sidebar" aria-label="Filters">
      <div>
        <h3>Category</h3>
        <ul>
          {categoryItems.map((item) => (
            <li key={item.slug}>
              <Link href={baseParams({ category: item.slug })}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Rating</h3>
        <ul>
          {[4, 3, 2].map((rating) => (
            <li key={rating}>
              <Link href={baseParams({ minRating: String(rating) })}>{rating}★ & above</Link>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/search" className="clear-filters">Clear all filters</Link>
    </aside>
  );
};
