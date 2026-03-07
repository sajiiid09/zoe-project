import { AppContainer } from "@/components/layout/AppContainer";
import { ErrorState } from "@/components/state/ErrorState";
import { PageIntro } from "@/components/layout/PageIntro";

export default function CheckoutPage() {
  return (
    <AppContainer>
      <PageIntro title="Checkout" description="Checkout shell prepared for address, payment, and review steps." crumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
      <ErrorState title="Checkout module pending integration" />
    </AppContainer>
  );
}
