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
      title="Pay now or review your profile setup first."
      description="This one-time fee is only required when you are ready to submit your affiliate profile for admin review. You can review and save the profile before paying."
      nextHref="/affiliate/profile"
      nextLabel="Go to affiliate profile"
      createSession={createAffiliateFeeSession}
      getStatus={getAffiliateFeeStatus}
      checklist={[
        "Secure Stripe checkout with one-time affiliate activation payment",
        "Profile details can be reviewed before payment and submitted after payment",
        "Performance analytics and payout tooling remain dependent on the broader rollout",
      ]}
    />
  );
}
