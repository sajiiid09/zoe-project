import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Admin Users" description="Admin users route scaffold for governance modules." />
      <EmptyState title="Users pending implementation" description="This route is phase-ready for advanced admin tooling." />
    </>
  );
}
