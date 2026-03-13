"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowSquareOut, CheckCircle, CreditCard, Spinner } from "@phosphor-icons/react";

import { RoleGuard } from "@/components/account/RoleGuard";
import { Button } from "@/components/ui/Button";

type RolePaymentPageProps = {
  role: "vendor" | "affiliate";
  title: string;
  description: string;
  badge: string;
  nextHref: string;
  nextLabel: string;
  createSession: () => Promise<{ url: string; sessionId: string }>;
  getStatus: () => Promise<boolean>;
  checklist: string[];
};

export const RolePaymentPage = ({
  role,
  title,
  description,
  badge,
  nextHref,
  nextLabel,
  createSession,
  getStatus,
  checklist,
}: RolePaymentPageProps) => {
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const status = await getStatus();
        if (!active) return;
        setPaid(status);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load payment status.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [getStatus]);

  const beginCheckout = async () => {
    setError("");
    setLaunching(true);

    try {
      const session = await createSession();
      if (!session.url) {
        throw new Error("Checkout URL was not returned by the backend.");
      }

      window.location.assign(session.url);
    } catch (checkoutError) {
      setLaunching(false);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start checkout right now."
      );
    }
  };

  return (
    <RoleGuard role={role}>
      <section className="auth-shell container">
        <div className="payment-stage">
          <div className="payment-showcase">
            <span className="payment-badge">{badge}</span>
            <h1>{title}</h1>
            <p>{description}</p>

            <ul className="payment-checklist">
              {checklist.map((item) => (
                <li key={item}>
                  <CheckCircle size={18} weight="fill" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className="payment-card">
            <div className="payment-card-header">
              <div className="payment-price">$10</div>
              <p>One-time onboarding fee handled through Stripe Checkout.</p>
            </div>

            {loading ? (
              <div className="payment-status-card">
                <Spinner size={20} className="spin" />
                <p>Checking your current payment status...</p>
              </div>
            ) : paid ? (
              <div className="payment-status-card payment-status-card-success">
                <CheckCircle size={22} weight="fill" />
                <div>
                  <h2>Payment already completed</h2>
                  <p>You can move straight into the next onboarding step.</p>
                </div>
                <Link href={nextHref} className="payment-inline-link">
                  {nextLabel}
                </Link>
              </div>
            ) : (
              <>
                <div className="payment-status-card">
                  <CreditCard size={22} weight="duotone" />
                  <div>
                    <h2>Choose your next step</h2>
                    <p>
                      Pay now to unlock submission immediately, or review your onboarding form first and pay later when you are ready to submit it for review.
                    </p>
                  </div>
                </div>

                {error ? <p className="form-error auth-form-error">{error}</p> : null}

                <div className="payment-actions">
                  <Button
                    type="button"
                    className="auth-submit-btn"
                    onClick={beginCheckout}
                    disabled={launching}
                  >
                    {launching ? "Redirecting to checkout..." : "Continue to secure payment"}
                  </Button>
                  <Link href={nextHref} className="payment-inline-link">
                    Review onboarding first
                    <ArrowSquareOut size={16} weight="bold" />
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </RoleGuard>
  );
};
