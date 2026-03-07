import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Vendor Submissions" description="Vendor submissions scaffold for future module integration." />
      <EmptyState title="Submissions module placeholder" description="This role-aware route is ready for implementation in later phases." />
    </>
  );
}
