import { AppContainer } from "@/components/layout/AppContainer";
import { EmptyState } from "@/components/state/EmptyState";
import { PageIntro } from "@/components/layout/PageIntro";

export default function WishlistPage() {
  return (
    <AppContainer>
      <PageIntro title="Wishlist" description="Wishlist scaffolding is ready for authenticated customer flows." crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <EmptyState title="No saved items yet" description="Items saved from listing and PDP routes will appear here once modules are connected." action="Start exploring" />
    </AppContainer>
  );
}
