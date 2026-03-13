"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Spinner, WarningCircle } from "@phosphor-icons/react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { Button } from "@/components/ui/Button";

type RolePaymentSuccessPageProps = {
  role: "vendor" | "affiliate";
  title: string;
  description: string;
  nextHref: string;
  nextLabel: string;
  retryHref: string;
  verifySession: (sessionId: string) => Promise<void>;
};

export const RolePaymentSuccessPage = ({
  role,
  title,
  description,
  nextHref,
  nextLabel,
  retryHref,
  verifySession,
}: RolePaymentSuccessPageProps) => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    sessionId ? "verifying" : "error"
  );
  const [error, setError] = useState(
    sessionId ? "" : "Missing Stripe session ID. Restart the onboarding payment flow."
  );

  useEffect(() => {
    let active = true;

    if (!sessionId) {
      return;
    }

    const runVerification = async () => {
      try {
        await verifySession(sessionId);
        if (!active) return;
        setStatus("success");
      } catch (verifyError) {
        if (!active) return;
        setStatus("error");
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : "Payment verification failed."
        );
      }
    };

    void runVerification();

    return () => {
      active = false;
    };
  }, [sessionId, verifySession]);

  return (
    <RoleGuard role={role}>
      <section className="auth-shell container">
        <div className="payment-stage payment-stage-success">
          <section className="payment-card payment-card-wide">
            <span className="payment-badge">{title}</span>
            <h1>{description}</h1>

            {status === "verifying" ? (
              <div className="payment-status-card">
                <Spinner size={20} className="spin" />
                <div>
                  <h2>Verifying payment</h2>
                  <p>Confirming your Stripe session with the backend before continuing.</p>
                </div>
              </div>
            ) : null}

            {status === "success" ? (
              <div className="payment-status-card payment-status-card-success">
                <CheckCircle size={22} weight="fill" />
                <div>
                  <h2>Payment confirmed</h2>
                  <p>Your account is active for the next onboarding step.</p>
                </div>
              </div>
            ) : null}

            {status === "error" ? (
              <div className="payment-status-card payment-status-card-error">
                <WarningCircle size={22} weight="fill" />
                <div>
                  <h2>Verification failed</h2>
                  <p>{error}</p>
                </div>
              </div>
            ) : null}

            <div className="payment-actions payment-actions-stacked">
              {status === "success" ? (
                <Link href={nextHref} className="auth-dialog-primary payment-primary-link">
                  {nextLabel}
                </Link>
              ) : (
                <Link href={retryHref} className="auth-dialog-primary payment-primary-link">
                  Return to payment page
                </Link>
              )}
              <Button variant="ghost" type="button" onClick={() => window.location.assign("/")}>
                Back to storefront
              </Button>
            </div>
          </section>
        </div>
      </section>
    </RoleGuard>
  );
};
