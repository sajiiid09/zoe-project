import Link from "next/link";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "deals", label: "Best Deals" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "new", label: "New Arrivals" },
] as const;

export const ListingToolbar = ({
  total,
  query,
  category,
  isSearch,
}: {
  total: number;
  query?: string;
  category?: string;
  isSearch?: boolean;
}) => {
  const buildSortHref = (sort: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    params.set("sort", sort);
    return `/search?${params.toString()}`;
  };

  return (
    <section className="listing-toolbar">
      <p>
        {isSearch ? `Showing ${total} results` : `${total} products`} {query ? `for “${query}”` : ""}
      </p>
      <div className="sort-pills" aria-label="Sort products">
        {sortOptions.map((item) => (
          <Link key={item.value} href={buildSortHref(item.value)}>
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
};
