import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Admin Catalog" description="Admin catalog route scaffold for governance modules." />
      <EmptyState title="Catalog pending implementation" description="This route is phase-ready for advanced admin tooling." />
    </>
  );
}
