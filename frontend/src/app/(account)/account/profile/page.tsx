import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/state/EmptyState";

export default function ProfilePage() {
  return (
    <>
      <PageIntro title="Profile" description="Customer identity and account preferences scaffold." />
      <EmptyState title="Profile modules coming next" description="Personal details, preferences, and security sections will be attached in future phases." />
    </>
  );
}
