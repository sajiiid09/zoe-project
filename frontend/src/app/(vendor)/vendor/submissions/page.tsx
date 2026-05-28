"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { MediaGallery } from "@/components/ops/MediaGallery";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { UrlListField } from "@/components/ops/UrlListField";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import {
  deleteVendorSubmission,
  getVendorStatus,
  listVendorSubmissions,
  saveVendorSubmission,
} from "@/lib/api/vendor";
import type { VendorSubmission } from "@/types/operations";

const blank: VendorSubmission = {
  id: "",
  title: "",
  category: "",
  description: "",
  images: [],
  status: "pending",
  vendorQuotedPrice: 0,
  suggestedRetailPrice: null,
  stockAvailable: 0,
  currency: "usd",
  reviewable: false,
  notes: "",
};

type SubmissionFilter = "all" | VendorSubmission["status"];

const money = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export default function VendorSubmissionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<VendorSubmission[]>([]);
  const [form, setForm] = useState<VendorSubmission>(blank);
  const [allowed, setAllowed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SubmissionFilter>("all");
  const [message, setMessage] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const refresh = async () => setItems(await listVendorSubmissions());

  useEffect(() => {
    const load = async () => {
      const status = await getVendorStatus();
      if (status !== "approved") {
        router.replace("/vendor/dashboard");
        return;
      }

      setAllowed(true);
      setItems(await listVendorSubmissions());
    };

    void load();
  }, [router]);

  if (!allowed) {
    return null;
  }

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.status === activeFilter);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      form.vendorQuotedPrice <= 0 ||
      form.stockAvailable < 0
    ) {
      setMessage("Title, category, a positive vendor quote, and valid stock are required.");
      return;
    }

    setMessage("");
    await saveVendorSubmission({ ...form, status: form.status || "pending" });
    setForm(blank);
    await refresh();
    setMessage(form.id ? "Submission updated." : "Submission created and sent for review.");
  };

  return (
    <>
      <PageIntro
        title="Catalog Submissions"
        description="Submit catalog-ready product proposals with real pricing, stock, and media fields instead of the previous placeholder form."
      />

      <MotionSection className="ops-panel" delay={0.03}>
        <form className="vendor-form-shell" onSubmit={submit}>
          <section className="vendor-form-section">
            <header className="vendor-form-header">
              <h2>{form.id ? "Edit submission" : "Create submission"}</h2>
              <p>Use this flow for catalog proposals that still need admin review before they become marketplace items, with direct image upload to Cloudinary.</p>
            </header>

            <div className="form-grid">
              <label className="field">
                <span className="field-label">Submission title</span>
                <input
                  className="field-input"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Submission title"
                />
              </label>
              <label className="field">
                <span className="field-label">Category</span>
                <input
                  className="field-input"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Category"
                />
              </label>
              <label className="field">
                <span className="field-label">Vendor quoted price</span>
                <input
                  className="field-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.vendorQuotedPrice || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      vendorQuotedPrice: Number(event.target.value),
                    }))
                  }
                  placeholder="79.99"
                />
              </label>
              <label className="field">
                <span className="field-label">Suggested retail price</span>
                <input
                  className="field-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.suggestedRetailPrice ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      suggestedRetailPrice: event.target.value
                        ? Number(event.target.value)
                        : null,
                    }))
                  }
                  placeholder="Optional"
                />
              </label>
              <label className="field">
                <span className="field-label">Stock available</span>
                <input
                  className="field-input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockAvailable || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      stockAvailable: Number(event.target.value),
                    }))
                  }
                  placeholder="0"
                />
              </label>
              <label className="field">
                <span className="field-label">Currency</span>
                <input
                  className="field-input"
                  value={form.currency}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      currency: event.target.value.toLowerCase(),
                    }))
                  }
                  placeholder="usd"
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">Description</span>
              <textarea
                className="field-input vendor-textarea"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe the product, differentiation, sourcing context, and anything the admin should consider before accepting it."
              />
            </label>

            <UrlListField
              label="Submission images"
              values={form.images}
              onChange={(images) => setForm((current) => ({ ...current, images }))}
              uploadScope="submission"
              hint="Upload from device or paste approved image URLs. The first image should represent the submission best."
              onUploadingChange={setIsUploadingMedia}
            />

            {message ? <p className="muted">{message}</p> : null}

            <div className="ops-actions-cell">
              <Button disabled={isUploadingMedia}>
                {isUploadingMedia
                  ? "Wait for uploads..."
                  : form.id
                    ? "Update submission"
                    : "Create submission"}
              </Button>
              {form.id ? (
                <Button type="button" variant="ghost" onClick={() => setForm(blank)}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </section>
        </form>
      </MotionSection>

      <MotionSection className="ops-panel" delay={0.08}>
        <div className="tabs" role="tablist" aria-label="Submission status filters">
          {["all", "pending", "accepted", "rejected"].map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                className={`tab ${active ? "tab-active" : ""}`}
                aria-selected={active}
                onClick={() => setActiveFilter(filter as SubmissionFilter)}
              >
                {filter === "all" ? "All" : filter}
              </button>
            );
          })}
        </div>

        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Submission</th>
                <th>Vendor quote</th>
                <th>Suggested retail</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <MotionTableRow key={item.id} delay={index * 0.018}>
                  <td>
                    <div>{item.title}</div>
                    <small className="muted">{item.category}</small>
                    {item.description ? (
                      <small className="muted vendor-table-copy">{item.description}</small>
                    ) : null}
                    {item.rejectionReason ? (
                      <small className="form-error">{item.rejectionReason}</small>
                    ) : null}
                  </td>
                  <td>{money(item.vendorQuotedPrice, item.currency.toUpperCase())}</td>
                  <td>
                    {item.suggestedRetailPrice !== null
                      ? money(item.suggestedRetailPrice, item.currency.toUpperCase())
                      : "Not provided"}
                  </td>
                  <td>{item.stockAvailable}</td>
                  <td>
                    <span className={`order-status ${item.status === "accepted" ? "delivered" : item.status === "rejected" ? "cancelled" : "processing"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="ops-actions-cell">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={item.status !== "pending"}
                      onClick={() => setForm({ ...blank, ...item })}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={item.status !== "pending"}
                      onClick={async () => {
                        await deleteVendorSubmission(item.id);
                        await refresh();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems[0] ? (
          <div className="vendor-review-summary">
            <div className="vendor-review-summary-card">
              <span>Reviewability</span>
              <strong>{filteredItems[0].reviewable ? "Ready for admin action" : "Already resolved"}</strong>
            </div>
            <div className="vendor-review-summary-card">
              <span>Latest vendor quote</span>
              <strong>{money(filteredItems[0].vendorQuotedPrice, filteredItems[0].currency.toUpperCase())}</strong>
            </div>
          </div>
        ) : null}

        {filteredItems[0]?.images?.length ? (
          <MediaGallery title="Selected submission media preview" images={filteredItems[0].images} />
        ) : null}
      </MotionSection>

      {!items.length ? <p className="muted">No submissions yet. Create your first submission above.</p> : null}
    </>
  );
}
