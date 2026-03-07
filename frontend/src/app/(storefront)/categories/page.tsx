import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { categories } from "@/lib/config/site";

export default function CategoriesPage() {
  return (
    <AppContainer>
      <PageIntro title="Shop by Category" description="Category-first browsing scaffold for future listing modules." crumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <div className="chips-wrap">
        {categories.map((category) => (
          <span key={category} className="chip">{category}</span>
        ))}
      </div>
    </AppContainer>
  );
}
