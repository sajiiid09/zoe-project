import { AppContainer } from "@/components/layout/AppContainer";
import { EmptyState } from "@/components/state/EmptyState";
import { PageIntro } from "@/components/layout/PageIntro";

export default function CartPage() {
  return (
    <AppContainer>
      <PageIntro title="Cart" description="Cart container route is ready for legacy order-flow integration." crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <EmptyState title="Your cart is empty" description="Saved items and pricing breakdown modules will be connected in upcoming phases." action="Continue shopping" />
    </AppContainer>
  );
}
