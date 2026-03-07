import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Admin Dashboard" description="Admin dashboard route scaffold for governance modules." />
      <EmptyState title="Dashboard pending implementation" description="This route is phase-ready for advanced admin tooling." />
    </>
  );
}
