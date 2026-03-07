import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Affiliate Profile" description="Affiliate profile route scaffold." />
      <EmptyState title="Profile under setup" description="Tracking, payouts, and link management will be implemented in future phases." />
    </>
  );
}
