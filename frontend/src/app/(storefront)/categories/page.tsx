import Link from "next/link";

import { AppContainer } from "@/components/layout/AppContainer";
import { CategoryShortcutRail } from "@/components/marketplace/CategoryShortcutRail";
import { ProductRail } from "@/components/marketplace/ProductRail";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";
import { categoryItems } from "@/lib/config/site";
import { listLegacyProducts } from "@/lib/api/products";

export default async function CategoriesPage() {
  const featuredByCategory = await Promise.all(
    categoryItems.map(async (category) => ({
      category,
      products: await listLegacyProducts({ category: category.slug, pageSize: 6, sort: "rating" }),
    })),
  );
  const productApiError = featuredByCategory.find((item) => item.products.error)?.products.error;

  return (
    <AppContainer>
      <PageIntro
        title="Shop by Category"
        description="Browse category-led collections optimized for fast product discovery."
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />

      <CategoryShortcutRail />

      <section className="category-grid-links">
        {categoryItems.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <span>{category.icon}</span>
            <strong>{category.label}</strong>
          </Link>
        ))}
      </section>

      {productApiError ? (
        <EmptyState
          title="Product service unavailable"
          description={productApiError.message}
        />
      ) : (
        featuredByCategory.map(({ category, products }) => (
          <ProductRail
            key={category.slug}
            title={`${category.label} highlights`}
            subtitle={`Top rated picks in ${category.label.toLowerCase()}`}
            href={`/categories/${category.slug}`}
            items={products.items}
          />
        ))
      )}
    </AppContainer>
  );
}
