"use client";

import { Suspense } from "react";

import { RolePaymentSuccessPage } from "@/components/auth/RolePaymentSuccessPage";
import { verifyAffiliateFeeSession } from "@/lib/api/payments";

export default function AffiliatePaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="auth-shell container">
          <div className="payment-stage payment-stage-success">
            <section className="payment-card payment-card-wide">
              <p>Verifying affiliate payment...</p>
            </section>
          </div>
        </section>
      }
    >
      <RolePaymentSuccessPage
        role="affiliate"
        title="Affiliate payment success"
        description="Confirming your affiliate activation before handing you over to profile setup."
        nextHref="/affiliate/profile"
        nextLabel="Continue to affiliate profile"
        retryHref="/affiliate-payment"
        verifySession={verifyAffiliateFeeSession}
      />
    </Suspense>
  );
}
