"use client";

import { RolePaymentPage } from "@/components/auth/RolePaymentPage";
import {
  createAffiliateFeeSession,
  getAffiliateFeeStatus,
} from "@/lib/api/payments";

export default function AffiliatePaymentPage() {
  return (
    <RolePaymentPage
      role="affiliate"
      badge="Affiliate onboarding"
      title="Activate your affiliate account before profile approval."
      description="This one-time fee unlocks affiliate onboarding so you can complete your profile, submit for approval, and prepare for link-based growth tools."
      nextHref="/affiliate/profile"
      nextLabel="Go to affiliate profile"
      createSession={createAffiliateFeeSession}
      getStatus={getAffiliateFeeStatus}
      checklist={[
        "Secure Stripe checkout with one-time affiliate activation payment",
        "Access to affiliate profile setup and approval pipeline",
        "Performance analytics and payout tooling remain dependent on the broader rollout",
      ]}
    />
  );
}
