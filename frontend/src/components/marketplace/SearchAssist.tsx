import Link from "next/link";

import { trendingSearches } from "@/lib/config/site";

export const SearchAssist = () => (
  <section className="search-assist" aria-label="Trending searches">
    <h3>Trending searches</h3>
    <div>
      {trendingSearches.map((term) => (
        <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>
      ))}
    </div>
  </section>
);
