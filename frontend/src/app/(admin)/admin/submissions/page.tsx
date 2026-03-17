"use client";

import { useEffect, useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { PageIntro } from "@/components/layout/PageIntro";
import { MediaGallery } from "@/components/ops/MediaGallery";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  listAdminSubmissions,
  readAdminErrorMessage,
  setAdminSubmissionStatus,
} from "@/lib/api/admin";
import type { VendorSubmission } from "@/types/operations";

const money = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<VendorSubmission[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeSubmission, setActiveSubmission] = useState<VendorSubmission | null>(null);
  const [retailPrice, setRetailPrice] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const refresh = async () => {
    setRows(await listAdminSubmissions());
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openDrawer = (submission: VendorSubmission) => {
    setError("");
    setActiveSubmission(submission);
    setRetailPrice(
      submission.suggestedRetailPrice !== null
        ? String(submission.suggestedRetailPrice)
        : ""
    );
    setRejectReason(submission.rejectionReason ?? "");
  };

  const closeDrawer = () => {
    setActiveSubmission(null);
    setRetailPrice("");
    setRejectReason("");
  };

  const handleReject = async (submission: VendorSubmission, reason?: string) => {
    setPendingActionId(`${submission.id}:reject`);
    setError("");

    try {
      await setAdminSubmissionStatus({
        id: submission.id,
        status: "rejected",
        reason,
      });
      closeDrawer();
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not reject this submission right now.")
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const handleAccept = async () => {
    if (!activeSubmission) {
      return;
    }

    setPendingActionId(`${activeSubmission.id}:accept`);
    setError("");

    try {
      await setAdminSubmissionStatus({
        id: activeSubmission.id,
        status: "accepted",
        retailPrice: Number(retailPrice),
      });
      closeDrawer();
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not accept this submission right now.")
      );
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <>
      <PageIntro
        title="Submission Review"
        description="Review vendor submissions for the catalog pipeline with explicit retail-price approval and editable rejection feedback."
      />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Vendor</th>
                <th>Vendor quote</th>
                <th>Suggested retail</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const acceptId = `${row.id}:accept`;
                const rejectId = `${row.id}:reject`;
                return (
                  <MotionTableRow key={row.id} delay={index * 0.02}>
                    <td>
                      <div>{row.title}</div>
                      <small className="muted">{row.category}</small>
                      {row.description ? (
                        <small className="muted vendor-table-copy">{row.description}</small>
                      ) : null}
                    </td>
                    <td>{row.vendorName || row.storeName || "Unknown vendor"}</td>
                    <td>{money(row.vendorQuotedPrice, row.currency.toUpperCase())}</td>
                    <td>
                      {row.suggestedRetailPrice !== null
                        ? money(row.suggestedRetailPrice, row.currency.toUpperCase())
                        : "Not provided"}
                    </td>
                    <td>
                      <span className={`order-status ${row.status === "accepted" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="ops-actions-cell">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pendingActionId !== null}
                        onClick={() => openDrawer(row)}
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        disabled={!row.reviewable || pendingActionId !== null}
                        onClick={() => openDrawer(row)}
                      >
                        {pendingActionId === acceptId ? "Accepting..." : "Accept to catalog"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!row.reviewable || pendingActionId !== null}
                        onClick={() =>
                          void handleReject(
                            row,
                            row.rejectionReason ?? "Rejected by admin"
                          )
                        }
                      >
                        {pendingActionId === rejectId ? "Rejecting..." : "Reject"}
                      </Button>
                    </td>
                  </MotionTableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </MotionSection>

      <Drawer
        open={activeSubmission !== null}
        onClose={closeDrawer}
        title="Review submission"
      >
        {activeSubmission ? (
          <div className="admin-review-drawer">
            <div className="admin-review-section">
              <span className="admin-review-kicker">submission</span>
              <h3>{activeSubmission.title}</h3>
              <p className="muted">
                {activeSubmission.vendorName || activeSubmission.storeName || "Unknown vendor"}
              </p>
            </div>

            <div className="admin-review-metrics">
              <article>
                <span>Vendor quote</span>
                <strong>{money(activeSubmission.vendorQuotedPrice, activeSubmission.currency.toUpperCase())}</strong>
              </article>
              <article>
                <span>Suggested retail</span>
                <strong>
                  {activeSubmission.suggestedRetailPrice !== null
                    ? money(
                        activeSubmission.suggestedRetailPrice,
                        activeSubmission.currency.toUpperCase()
                      )
                    : "Not provided"}
                </strong>
              </article>
            </div>

            <div className="admin-review-details">
              <div>
                <span>Category</span>
                <strong>{activeSubmission.category}</strong>
              </div>
              <div>
                <span>Stock available</span>
                <strong>{activeSubmission.stockAvailable}</strong>
              </div>
              <div>
                <span>Store</span>
                <strong>{activeSubmission.storeName || "Not available"}</strong>
              </div>
            </div>

            <div className="admin-review-copy">
              <span>Description</span>
              <p>{activeSubmission.description || "No description provided."}</p>
            </div>

            <MediaGallery
              title="Submission images"
              images={activeSubmission.images}
              emptyLabel="No submission images provided"
            />

            <label className="field" htmlFor="submission-retail-price">
              <span className="field-label">Retail price</span>
              <input
                id="submission-retail-price"
                className="field-input"
                type="number"
                min="0.01"
                step="0.01"
                value={retailPrice}
                onChange={(event) => setRetailPrice(event.target.value)}
                placeholder="Enter catalog retail price"
              />
              <span className="field-hint">
                Suggested price is prefilled when available. Vendor quote is shown for reference only.
              </span>
            </label>

            <label className="field" htmlFor="submission-reject-reason">
              <span className="field-label">Reject reason</span>
              <textarea
                id="submission-reject-reason"
                className="field-input vendor-textarea vendor-textarea-compact"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Explain why this submission should be revised or rejected."
              />
            </label>

            <div className="ops-actions-cell">
              <Button
                type="button"
                disabled={!activeSubmission.reviewable || pendingActionId !== null}
                onClick={() => void handleAccept()}
              >
                {pendingActionId === `${activeSubmission.id}:accept`
                  ? "Accepting..."
                  : "Accept into catalog"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!activeSubmission.reviewable || pendingActionId !== null}
                onClick={() =>
                  void handleReject(
                    activeSubmission,
                    rejectReason || "Rejected by admin"
                  )
                }
              >
                {pendingActionId === `${activeSubmission.id}:reject`
                  ? "Rejecting..."
                  : "Reject"}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
