export const storefrontNav = [
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/search?sort=deals" },
  { label: "Top Rated", href: "/search?sort=rating" },
  { label: "New Arrivals", href: "/search?sort=new" },
  { label: "Daily Essentials", href: "/search?q=essentials" },
  { label: "Electronics", href: "/search?category=electronics" },
  { label: "Fashion", href: "/search?category=fashion" },
  { label: "Home", href: "/search?category=home" },
];

export const categoryItems = [
  { slug: "electronics", label: "Electronics", icon: "🔌" },
  { slug: "fashion", label: "Fashion", icon: "👕" },
  { slug: "groceries", label: "Groceries", icon: "🛒" },
  { slug: "home", label: "Home", icon: "🛋️" },
  { slug: "beauty", label: "Beauty", icon: "💄" },
  { slug: "sports", label: "Sports", icon: "🏃" },
  { slug: "baby", label: "Baby", icon: "🍼" },
  { slug: "automotive", label: "Automotive", icon: "🚗" },
];

export const trendingSearches = [
  "iphone 15",
  "wireless earbuds",
  "gaming chair",
  "air fryer",
  "baby diapers",
  "laptop stand",
];

export const homepagePromos = [
  {
    title: "Mega Deal Days",
    description: "Up to 50% off electronics and appliances",
    href: "/search?sort=deals&category=electronics",
    tone: "warm" as const,
  },
  {
    title: "Everyday Essentials",
    description: "Fast delivery on household and grocery staples",
    href: "/search?category=groceries",
    tone: "cool" as const,
  },
  {
    title: "Fashion Flash",
    description: "New arrivals from top local brands",
    href: "/search?category=fashion&sort=new",
    tone: "neutral" as const,
  },
];
