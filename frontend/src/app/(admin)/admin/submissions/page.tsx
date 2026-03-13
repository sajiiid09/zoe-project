"use client";

import { useEffect, useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  listAdminSubmissions,
  readAdminErrorMessage,
  setAdminSubmissionStatus,
} from "@/lib/api/admin";
import type { VendorSubmission } from "@/types/operations";

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<VendorSubmission[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeSubmission, setActiveSubmission] = useState<VendorSubmission | null>(null);
  const [retailPrice, setRetailPrice] = useState("");

  const refresh = async () => {
    setRows(await listAdminSubmissions());
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openAcceptDrawer = (submission: VendorSubmission) => {
    setError("");
    setActiveSubmission(submission);
    setRetailPrice(
      submission.suggestedRetailPrice !== null
        ? String(submission.suggestedRetailPrice)
        : ""
    );
  };

  const closeAcceptDrawer = () => {
    setActiveSubmission(null);
    setRetailPrice("");
  };

  const handleReject = async (submission: VendorSubmission) => {
    setPendingActionId(`${submission.id}:reject`);
    setError("");

    try {
      await setAdminSubmissionStatus({ id: submission.id, status: "rejected" });
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
      closeAcceptDrawer();
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
        description="Review vendor submissions for the catalog migration pipeline with explicit retail-price approval."
      />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Vendor Quote</th>
                <th>Suggested Retail</th>
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
                      {row.notes ? <small className="muted">{row.notes}</small> : null}
                    </td>
                    <td>{row.category}</td>
                    <td>{money(row.vendorQuotedPrice)}</td>
                    <td>
                      {row.suggestedRetailPrice !== null
                        ? money(row.suggestedRetailPrice)
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
                        disabled={!row.reviewable || pendingActionId !== null}
                        onClick={() => openAcceptDrawer(row)}
                      >
                        {pendingActionId === acceptId ? "Accepting..." : "Accept to Catalog"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!row.reviewable || pendingActionId !== null}
                        onClick={() => void handleReject(row)}
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
        onClose={closeAcceptDrawer}
        title="Accept submission into catalog"
      >
        {activeSubmission ? (
          <div className="admin-review-drawer">
            <p className="muted">
              Confirm the catalog retail price before accepting <strong>{activeSubmission.title}</strong>.
            </p>
            <div className="admin-review-metrics">
              <article>
                <span>Vendor quote</span>
                <strong>{money(activeSubmission.vendorQuotedPrice)}</strong>
              </article>
              <article>
                <span>Suggested retail</span>
                <strong>
                  {activeSubmission.suggestedRetailPrice !== null
                    ? money(activeSubmission.suggestedRetailPrice)
                    : "Not provided"}
                </strong>
              </article>
            </div>
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
            <div className="ops-actions-cell">
              <Button
                type="button"
                disabled={pendingActionId !== null}
                onClick={() => void handleAccept()}
              >
                {pendingActionId === `${activeSubmission.id}:accept`
                  ? "Accepting..."
                  : "Accept into catalog"}
              </Button>
              <Button type="button" variant="ghost" onClick={closeAcceptDrawer}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
