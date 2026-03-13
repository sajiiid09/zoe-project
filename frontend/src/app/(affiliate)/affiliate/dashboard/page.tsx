"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { getAffiliateProfile, getAffiliateStatus } from "@/lib/api/affiliate";
import type { AccessStatus, AffiliateProfile } from "@/types/operations";

const statusText: Record<AccessStatus, string> = {
  setup_required: "Setup required",
  payment_required: "Ready for payment",
  needs_changes: "Needs changes",
  approved: "Approved",
  pending: "Pending review",
  blocked: "Blocked",
};

export default function AffiliateDashboardPage() {
  const [status, setStatus] = useState<AccessStatus>("setup_required");
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);

  useEffect(() => {
    void getAffiliateStatus().then(setStatus);
    void getAffiliateProfile().then(setProfile);
  }, []);

  return (
    <>
      <PageIntro title="Affiliate Dashboard" description="Manage affiliate onboarding before the broader workspace unlocks." />

      <section className="ops-banner">
        <p>Status: <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" || status === "needs_changes" ? "cancelled" : "processing"}`}>{statusText[status]}</span></p>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Full performance tracking, affiliate links, and commission payouts will become available as soon as the transition is complete.
        </p>
        {status === "setup_required" ? (
          <Link href="/affiliate/profile" className="chip" style={{ width: "fit-content", marginTop: "0.45rem" }}>
            {profile ? "Continue profile setup" : "Start profile setup"}
          </Link>
        ) : null}
        {status === "payment_required" ? (
          <Link href="/affiliate-payment" className="chip" style={{ width: "fit-content", marginTop: "0.45rem" }}>
            Pay to submit for review
          </Link>
        ) : null}
        {status === "needs_changes" ? (
          <Link href="/affiliate/profile" className="chip" style={{ width: "fit-content", marginTop: "0.45rem" }}>
            Update profile and resubmit
          </Link>
        ) : null}
      </section>

      <section className="ops-stats-grid">
        <article><h3>{profile?.displayName ?? "-"}</h3><p>Display name</p></article>
        <article><h3>{profile?.channel ?? "-"}</h3><p>Primary channel</p></article>
        <article><h3>{profile?.audienceRegion ?? "-"}</h3><p>Audience region</p></article>
      </section>

      {status === "approved" && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>Performance (Coming Soon)</h2>
          <div className="ops-stats-grid" style={{ opacity: 0.6 }}>
            <article><h3>--</h3><p>Total Clicks</p></article>
            <article><h3>$0.00</h3><p>Pending Payout</p></article>
            <article><h3>--</h3><p>Active Referrals</p></article>
          </div>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.5rem" }}>Analytics and link generation tools will be activated in an upcoming platform release.</p>
        </section>
      )}
      {status !== "approved" ? (
        <section className="state-box" style={{ marginTop: "1.5rem" }}>
          <h2>Affiliate tools unlock after onboarding approval</h2>
          <p>
            {status === "setup_required"
              ? "Complete your profile first. Once it is ready, you can pay the onboarding fee and submit it for admin review."
              : status === "payment_required"
                ? "Your profile is ready. Complete the one-time onboarding payment to submit the request for admin review."
                : status === "needs_changes"
                  ? "Admin requested changes to your profile. Update the form and save again to resubmit."
                  : "Your affiliate profile has been submitted and is waiting for admin review."}
          </p>
        </section>
      ) : null}
    </>
  );
}
