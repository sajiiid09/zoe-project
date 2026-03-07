"use client";

import { Search } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { trendingSearches } from "@/lib/config/site";

export const SearchField = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const suggestions = useMemo(() => {
    if (!query) return trendingSearches.slice(0, 6);
    return trendingSearches.filter((item) => item.includes(query.toLowerCase())).slice(0, 6);
  }, [query]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form className="search-wrap" role="search" onSubmit={onSubmit}>
      <Search size={18} aria-hidden="true" />
      <div className="search-control">
        <input
          aria-label="Search products"
          name="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for products, brands, and categories"
        />
        <div className="search-suggest" aria-label="Search suggestions">
          {suggestions.map((item) => (
            <button key={item} type="button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <button className="search-submit" type="submit">
        Search
      </button>
    </form>
  );
};
