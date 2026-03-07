import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Admin Orders" description="Admin orders route scaffold for governance modules." />
      <EmptyState title="Orders pending implementation" description="This route is phase-ready for advanced admin tooling." />
    </>
  );
}
