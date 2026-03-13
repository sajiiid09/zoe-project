"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { getVendorFeeStatus } from "@/lib/api/payments";
import { getVendorStatus, getVendorStore, saveVendorStore } from "@/lib/api/vendor";
import type { AccessStatus, VendorStore } from "@/types/operations";

const blank: VendorStore = { id: "", name: "", description: "", supportEmail: "" };

const statusText: Record<AccessStatus, string> = {
  setup_required: "Setup required",
  payment_required: "Ready for payment",
  pending: "Pending review",
  approved: "Approved",
  needs_changes: "Needs changes",
  blocked: "Blocked",
};

export default function VendorStorePage() {
  const [form, setForm] = useState<VendorStore>(blank);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<AccessStatus>("setup_required");
  const [feePaid, setFeePaid] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [store, currentStatus, paid] = await Promise.all([
        getVendorStore(),
        getVendorStatus(),
        getVendorFeeStatus(),
      ]);

      if (store) setForm(store);
      setStatus(currentStatus);
      setFeePaid(paid);
    };

    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.supportEmail) {
      setMessage("Store name and support email are required.");
      return;
    }
    setSaving(true);
    const saved = await saveVendorStore(form);
    setForm(saved);
    const [nextStatus, paid] = await Promise.all([getVendorStatus(), getVendorFeeStatus()]);
    setStatus(nextStatus);
    setFeePaid(paid);
    setMessage(
      nextStatus === "approved"
        ? "Store updated successfully."
        : nextStatus === "pending"
          ? "Store saved and submitted for admin review."
          : paid
            ? "Store saved. Complete any remaining adjustments before review."
            : "Store saved. Pay the onboarding fee when you are ready to submit it for admin review."
    );
    setSaving(false);
  };

  return (
    <>
      <PageIntro title="Store Management" description="Create and maintain your vendor storefront details." />
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-banner" style={{ marginBottom: "1rem" }}>
          <p>
            Status:{" "}
            <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" || status === "needs_changes" ? "cancelled" : "processing"}`}>
              {statusText[status]}
            </span>
          </p>
          {!feePaid ? (
            <Link className="chip" href="/vendor-payment">
              {form.name && form.supportEmail ? "Pay to submit for review" : "Pay later after setup"}
            </Link>
          ) : null}
        </div>
        <form className="address-form" onSubmit={submit}>
          <div className="form-grid">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Store name" />
            <input type="email" value={form.supportEmail} onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))} placeholder="Support email" />
            <input value={form.id} disabled placeholder="Store ID" />
            <input value="Marketplace vendor" disabled />
          </div>
          <textarea className="ops-textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Store description" />
          {message ? <p className="muted">{message}</p> : null}
          <Button disabled={saving}>{saving ? "Saving..." : "Save store details"}</Button>
        </form>
      </MotionSection>
    </>
  );
}
