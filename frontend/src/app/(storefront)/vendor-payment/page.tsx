"use client";

import { RolePaymentPage } from "@/components/auth/RolePaymentPage";
import {
  createVendorFeeSession,
  getVendorFeeStatus,
} from "@/lib/api/payments";

export default function VendorPaymentPage() {
  return (
    <RolePaymentPage
      role="vendor"
      badge="Vendor onboarding"
      title="Pay now or review your store setup first."
      description="This one-time fee is only required when you are ready to submit your store for admin review. You can review and save your store setup before paying."
      nextHref="/vendor/store"
      nextLabel="Go to store setup"
      createSession={createVendorFeeSession}
      getStatus={getVendorFeeStatus}
      checklist={[
        "Secure Stripe checkout with one-time vendor activation payment",
        "Store details can be reviewed before payment and submitted after payment",
        "Approval still required after payment before the vendor workspace becomes fully active",
      ]}
    />
  );
}
