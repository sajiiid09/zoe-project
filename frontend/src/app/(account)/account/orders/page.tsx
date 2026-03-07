import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function OrdersPage() {
  return (
    <>
      <PageIntro title="Orders" description="Order timeline route prepared for legacy order APIs." />
      <EmptyState title="No order history yet" description="Order list, details, and return actions will be added when order module is implemented." />
    </>
  );
}
