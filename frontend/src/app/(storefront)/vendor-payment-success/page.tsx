"use client";

import { Suspense } from "react";

import { RolePaymentSuccessPage } from "@/components/auth/RolePaymentSuccessPage";
import { verifyVendorFeeSession } from "@/lib/api/payments";

export default function VendorPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="auth-shell container">
          <div className="payment-stage payment-stage-success">
            <section className="payment-card payment-card-wide">
              <p>Verifying vendor payment...</p>
            </section>
          </div>
        </section>
      }
    >
      <RolePaymentSuccessPage
        role="vendor"
        title="Vendor payment success"
        description="Confirming your vendor activation before handing you over to store setup."
        nextHref="/vendor/store"
        nextLabel="Continue to store setup"
        retryHref="/vendor-payment"
        verifySession={verifyVendorFeeSession}
      />
    </Suspense>
  );
}
