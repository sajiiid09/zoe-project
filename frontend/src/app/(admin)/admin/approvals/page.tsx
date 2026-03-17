"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MediaGallery } from "@/components/ops/MediaGallery";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import {
  listAdminApprovalQueue,
  readAdminErrorMessage,
  setAdminApprovalStatus,
} from "@/lib/api/admin";
import type { AdminApprovalRow } from "@/types/operations";

export default function AdminApprovalsPage() {
  const [rows, setRows] = useState<AdminApprovalRow[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeRow, setActiveRow] = useState<AdminApprovalRow | null>(null);
  const [changeReason, setChangeReason] = useState("");

  const refresh = async () => {
    setRows(await listAdminApprovalQueue());
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openDrawer = (row: AdminApprovalRow) => {
    setActiveRow(row);
    setChangeReason(row.rejectionNote ?? "");
    setError("");
  };

  const closeDrawer = () => {
    setActiveRow(null);
    setChangeReason("");
  };

  const handleAction = async (
    row: AdminApprovalRow,
    status: "approved" | "needs_changes",
    reason?: string
  ) => {
    setPendingActionId(`${row.id}:${status}`);
    setError("");

    try {
      await setAdminApprovalStatus(
        {
          approvalTargetType: row.approvalTargetType,
          approvalTargetId: row.approvalTargetId,
        },
        status,
        reason
      );
      closeDrawer();
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not update this approval right now.")
      );
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <>
      <PageIntro
        title="Approvals"
        description="Review vendor stores and affiliate profiles that are actually ready for admin approval."
      />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Onboarding</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const approveId = `${row.id}:approved`;
                const rejectId = `${row.id}:needs_changes`;
                return (
                  <MotionTableRow key={row.id} delay={index * 0.02}>
                    <td>
                      <div>{row.name}</div>
                      {row.storeName ? <small className="muted">{row.storeName}</small> : null}
                    </td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>
                      <span className="order-status processing">
                        {row.onboardingStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className="order-status processing">{row.approvalStatus}</span>
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
                        disabled={pendingActionId !== null}
                        onClick={() => void handleAction(row, "approved")}
                      >
                        {pendingActionId === approveId ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pendingActionId !== null}
                        onClick={() =>
                          void handleAction(
                            row,
                            "needs_changes",
                            row.rejectionNote ?? "Changes requested by admin"
                          )
                        }
                      >
                        {pendingActionId === rejectId ? "Sending..." : "Request changes"}
                      </Button>
                    </td>
                  </MotionTableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </MotionSection>
      {!rows.length ? (
        <p className="muted">No actionable approvals right now.</p>
      ) : null}

      <Drawer
        open={activeRow !== null}
        onClose={closeDrawer}
        title={activeRow?.role === "vendor" ? "Review vendor store" : "Review profile"}
      >
        {activeRow ? (
          <div className="admin-review-drawer">
            <div className="admin-review-section">
              <span className="admin-review-kicker">{activeRow.role}</span>
              <h3>{activeRow.storeName || activeRow.name}</h3>
              <p className="muted">{activeRow.email}</p>
            </div>

            <div className="admin-review-metrics">
              <article>
                <span>Onboarding</span>
                <strong>{activeRow.onboardingStatus.replaceAll("_", " ")}</strong>
              </article>
              <article>
                <span>Approval state</span>
                <strong>{activeRow.approvalStatus}</strong>
              </article>
            </div>

            {activeRow.role === "vendor" ? (
              <>
                <div className="admin-review-details">
                  <div>
                    <span>Support email</span>
                    <strong>{activeRow.storeEmail || "Not provided"}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{activeRow.storePhone || "Not provided"}</strong>
                  </div>
                  <div>
                    <span>Address</span>
                    <strong>{activeRow.storeAddress || "Not provided"}</strong>
                  </div>
                </div>
                <div className="admin-review-copy">
                  <span>Description</span>
                  <p>{activeRow.storeDescription || "No description provided."}</p>
                </div>
                <MediaGallery
                  title="Store media"
                  images={[activeRow.storeLogo, activeRow.storeBanner].filter(
                    (item): item is string => Boolean(item)
                  )}
                  emptyLabel="No store media URLs provided"
                />
              </>
            ) : (
              <div className="admin-review-copy">
                <span>Profile context</span>
                <p>
                  Affiliate approval is still handled on the existing backend workflow. Use the
                  reason field below if you want to request changes.
                </p>
              </div>
            )}

            <label className="field" htmlFor="approval-change-reason">
              <span className="field-label">Request changes reason</span>
              <textarea
                id="approval-change-reason"
                className="field-input vendor-textarea vendor-textarea-compact"
                value={changeReason}
                onChange={(event) => setChangeReason(event.target.value)}
                placeholder="Explain what must change before approval."
              />
            </label>

            <div className="ops-actions-cell">
              <Button
                type="button"
                disabled={pendingActionId !== null}
                onClick={() => void handleAction(activeRow, "approved")}
              >
                {pendingActionId === `${activeRow.id}:approved` ? "Approving..." : "Approve"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pendingActionId !== null}
                onClick={() =>
                  void handleAction(
                    activeRow,
                    "needs_changes",
                    changeReason || "Changes requested by admin"
                  )
                }
              >
                {pendingActionId === `${activeRow.id}:needs_changes`
                  ? "Sending..."
                  : "Request changes"}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
