import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Affiliate Dashboard" description="Affiliate dashboard route scaffold." />
      <EmptyState title="Dashboard under setup" description="Tracking, payouts, and link management will be implemented in future phases." />
    </>
  );
}
