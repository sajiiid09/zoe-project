import { AppContainer } from "@/components/layout/AppContainer";
import { EmptyState } from "@/components/state/EmptyState";
import { PageIntro } from "@/components/layout/PageIntro";

export default function SearchPage() {
  return (
    <AppContainer>
      <PageIntro title="Search Results" description="Listing architecture placeholder with pagination/filter ready structure." crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <EmptyState title="No applied listing module yet" description="Result grids, sorting, filters, and pagination UI will be added in the next phase on top of this route foundation." action="Clear filters" />
    </AppContainer>
  );
}
