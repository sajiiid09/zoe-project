"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { getAffiliateFeeStatus } from "@/lib/api/payments";
import {
  getAffiliateProfile,
  getAffiliateStatus,
  saveAffiliateProfile,
} from "@/lib/api/affiliate";
import type { AccessStatus, AffiliateProfile } from "@/types/operations";

const blank: AffiliateProfile = {
  id: "",
  displayName: "",
  channel: "",
  audienceRegion: "",
  status: "pending",
};

const statusText: Record<AccessStatus, string> = {
  setup_required: "Setup required",
  payment_required: "Ready for payment",
  pending: "Pending review",
  approved: "Approved",
  needs_changes: "Needs changes",
  blocked: "Blocked",
};

export default function AffiliateProfilePage() {
  const [form, setForm] = useState<AffiliateProfile>(blank);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<AccessStatus>("setup_required");
  const [feePaid, setFeePaid] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [profile, currentStatus, paid] = await Promise.all([
        getAffiliateProfile(),
        getAffiliateStatus(),
        getAffiliateFeeStatus(),
      ]);

      if (profile) setForm(profile);
      setStatus(currentStatus);
      setFeePaid(paid);
    };

    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.displayName || !form.channel || !form.audienceRegion) {
      setMessage("Please complete all profile fields.");
      return;
    }
    const saved = await saveAffiliateProfile({
      ...form,
      status: form.status || "pending",
    });
    setForm(saved);
    const [nextStatus, paid] = await Promise.all([
      getAffiliateStatus(),
      getAffiliateFeeStatus(),
    ]);
    setStatus(nextStatus);
    setFeePaid(paid);
    setMessage(
      nextStatus === "approved"
        ? "Affiliate profile updated successfully."
        : nextStatus === "pending"
          ? "Affiliate profile saved and submitted for admin review."
          : paid
            ? "Affiliate profile saved. Complete any remaining adjustments before review."
            : "Affiliate profile saved. Pay the onboarding fee when you are ready to submit it for admin review."
    );
  };

  return (
    <>
      <PageIntro title="Affiliate Profile" description="Manage onboarding profile required for affiliate approval." />
      <section className="ops-banner" style={{ marginBottom: "1rem" }}>
        <p>
          Status:{" "}
          <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" || status === "needs_changes" ? "cancelled" : "processing"}`}>
            {statusText[status]}
          </span>
        </p>
        {!feePaid ? (
          <Link href="/affiliate-payment" className="chip" style={{ width: "fit-content", marginTop: "0.45rem" }}>
            {form.displayName && form.channel && form.audienceRegion
              ? "Pay to submit for review"
              : "Pay later after setup"}
          </Link>
        ) : null}
      </section>
      <form className="address-form" onSubmit={submit}>
        <div className="form-grid">
          <input value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} placeholder="Display name" />
          <input value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} placeholder="Primary channel" />
          <input value={form.audienceRegion} onChange={(e) => setForm((p) => ({ ...p, audienceRegion: e.target.value }))} placeholder="Audience region" />
          <input value={form.status} disabled />
        </div>
        {message && (
          <div style={{ padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", backgroundColor: message.includes("saved") ? "#f0fdf4" : "#fef2f2", color: message.includes("saved") ? "#166534" : "#991b1b", border: `1px solid ${message.includes("saved") ? "#bbf7d0" : "#fecaca"}`, marginTop: "0.4rem" }}>
            {message}
          </div>
        )}
        <Button style={{ marginTop: "0.25rem" }}>Save affiliate profile</Button>
      </form>
    </>
  );
}
