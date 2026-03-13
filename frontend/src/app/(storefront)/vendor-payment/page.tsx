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
      title="Activate your vendor account before opening your store."
      description="This one-time fee unlocks the vendor onboarding path, including store setup, approval tracking, and product workflows."
      nextHref="/vendor/store"
      nextLabel="Go to store setup"
      createSession={createVendorFeeSession}
      getStatus={getVendorFeeStatus}
      checklist={[
        "Secure Stripe checkout with one-time vendor activation payment",
        "Access to store setup, product creation, and submission workflow",
        "Approval still required after payment before the store becomes fully active",
      ]}
    />
  );
}
