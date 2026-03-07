import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Vendor Dashboard" description="Vendor dashboard scaffold for future module integration." />
      <EmptyState title="Dashboard module placeholder" description="This role-aware route is ready for implementation in later phases." />
    </>
  );
}
