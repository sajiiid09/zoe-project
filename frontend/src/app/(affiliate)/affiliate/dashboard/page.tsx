"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { getAffiliateProfile, getAffiliateStatus } from "@/lib/api/affiliate";
import type { AccessStatus, AffiliateProfile } from "@/types/operations";

const statusText: Record<AccessStatus, string> = {
  approved: "Approved",
  pending: "Pending review",
  blocked: "Blocked",
  payment_required: "Payment required",
};

export default function AffiliateDashboardPage() {
  const [status, setStatus] = useState<AccessStatus>("pending");
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);

  useEffect(() => {
    void getAffiliateStatus().then(setStatus);
    void getAffiliateProfile().then(setProfile);
  }, []);

  return (
    <>
      <PageIntro title="Affiliate Dashboard" description="Approval and profile status for affiliate onboarding." />

      <section className="ops-banner">
        <p>Status: <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" ? "cancelled" : "processing"}`}>{statusText[status]}</span></p>
        <p className="muted">Affiliate links, attribution, commissions, and payouts are not yet enabled in this phase.</p>
      </section>

      <section className="ops-stats-grid">
        <article><h3>{profile?.displayName ?? "-"}</h3><p>Display name</p></article>
        <article><h3>{profile?.channel ?? "-"}</h3><p>Primary channel</p></article>
        <article><h3>{profile?.audienceRegion ?? "-"}</h3><p>Audience region</p></article>
      </section>
    </>
  );
}
