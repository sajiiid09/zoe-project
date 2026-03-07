import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function Page() {
  return (
    <>
      <PageIntro title="Vendor Products" description="Vendor products scaffold for future module integration." />
      <EmptyState title="Products module placeholder" description="This role-aware route is ready for implementation in later phases." />
    </>
  );
}
