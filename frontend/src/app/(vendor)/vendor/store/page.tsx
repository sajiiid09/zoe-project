"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { getVendorFeeStatus } from "@/lib/api/payments";
import { getVendorStatus, getVendorStore, saveVendorStore } from "@/lib/api/vendor";
import type { AccessStatus, VendorStore } from "@/types/operations";

const blank: VendorStore = {
  id: "",
  name: "",
  slug: "",
  description: "",
  supportEmail: "",
  phone: "",
  address: "",
  logo: "",
  banner: "",
};

const statusText: Record<AccessStatus, string> = {
  setup_required: "Setup required",
  payment_required: "Ready for payment",
  pending: "Pending review",
  approved: "Approved",
  needs_changes: "Needs changes",
  blocked: "Blocked",
};

const PreviewCard = ({ src, label }: { src: string; label: string }) => (
  <div className="store-media-card">
    <span className="field-label">{label}</span>
    {src.trim() ? (
      <div className="store-media-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`${label} preview`} />
      </div>
    ) : (
      <div className="store-media-empty">Paste an image URL to preview this asset.</div>
    )}
  </div>
);

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

      if (store) {
        setForm({ ...blank, ...store });
      }
      setStatus(currentStatus);
      setFeePaid(paid);
    };

    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.supportEmail.trim()) {
      setMessage("Store name and support email are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const saved = await saveVendorStore(form);
      setForm({ ...blank, ...saved });
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
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageIntro
        title="Store Management"
        description="Complete your public store profile and media so the admin review queue sees a real vendor setup instead of a placeholder."
      />
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-banner store-status-banner">
          <div>
            <p>
              Status:{" "}
              <span
                className={`order-status ${
                  status === "approved"
                    ? "delivered"
                    : status === "payment_required" || status === "needs_changes"
                      ? "cancelled"
                      : "processing"
                }`}
              >
                {statusText[status]}
              </span>
            </p>
            <p className="muted">
              Required for review: store name and support email. Everything else improves the real storefront and gives admins enough context to review you properly.
            </p>
            {form.rejectionNote ? (
              <p className="form-error vendor-rejection-note">{form.rejectionNote}</p>
            ) : null}
          </div>
          {!feePaid ? (
            <Link className="chip" href="/vendor-payment">
              {form.name && form.supportEmail ? "Pay to submit for review" : "Pay later after setup"}
            </Link>
          ) : null}
        </div>

        <form className="vendor-form-shell" onSubmit={submit}>
          <section className="vendor-form-section">
            <header className="vendor-form-header">
              <h2>Store identity</h2>
              <p>Basic storefront information visible to admins and later to customers.</p>
            </header>
            <div className="form-grid">
              <label className="field">
                <span className="field-label">Store name</span>
                <input
                  className="field-input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Example: Aurora Electronics"
                />
              </label>
              <label className="field">
                <span className="field-label">Support email</span>
                <input
                  className="field-input"
                  type="email"
                  value={form.supportEmail}
                  onChange={(event) => setForm((current) => ({ ...current, supportEmail: event.target.value }))}
                  placeholder="support@yourstore.com"
                />
              </label>
              <label className="field">
                <span className="field-label">Store phone</span>
                <input
                  className="field-input"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="+1 555 010 2020"
                />
              </label>
              <label className="field">
                <span className="field-label">Store slug</span>
                <input
                  className="field-input"
                  value={form.slug || ""}
                  disabled
                  placeholder="Generated by backend"
                />
              </label>
            </div>
            <label className="field">
              <span className="field-label">Store description</span>
              <textarea
                className="field-input vendor-textarea"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Tell admins and future customers what your store specializes in."
              />
            </label>
            <label className="field">
              <span className="field-label">Store address</span>
              <textarea
                className="field-input vendor-textarea vendor-textarea-compact"
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                placeholder="Street, city, region, postal code, country"
              />
            </label>
          </section>

          <section className="vendor-form-section">
            <header className="vendor-form-header">
              <h2>Brand media</h2>
              <p>Cloudinary is deferred, so use direct image URLs for now.</p>
            </header>
            <div className="form-grid">
              <label className="field">
                <span className="field-label">Logo URL</span>
                <input
                  className="field-input"
                  type="url"
                  value={form.logo}
                  onChange={(event) => setForm((current) => ({ ...current, logo: event.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </label>
              <label className="field">
                <span className="field-label">Banner URL</span>
                <input
                  className="field-input"
                  type="url"
                  value={form.banner}
                  onChange={(event) => setForm((current) => ({ ...current, banner: event.target.value }))}
                  placeholder="https://example.com/banner.jpg"
                />
              </label>
            </div>
            <div className="store-media-grid">
              <PreviewCard src={form.logo} label="Logo preview" />
              <PreviewCard src={form.banner} label="Banner preview" />
            </div>
          </section>

          {message ? <p className="muted">{message}</p> : null}
          <div className="ops-actions-cell">
            <Button disabled={saving}>{saving ? "Saving..." : "Save store details"}</Button>
            {status !== "approved" && !feePaid ? (
              <Link className="chip" href="/vendor-payment">
                Continue to payment
              </Link>
            ) : null}
          </div>
        </form>
      </MotionSection>
    </>
  );
}
