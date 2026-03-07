import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function AddressesPage() {
  return (
    <>
      <PageIntro title="Addresses" description="Address book route for checkout and delivery context." />
      <EmptyState title="No addresses" description="Address CRUD UI and validation will be integrated with backend in upcoming phases." action="Add address" />
    </>
  );
}
