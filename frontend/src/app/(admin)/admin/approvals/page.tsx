"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
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

  const refresh = async () => {
    setRows(await listAdminApprovalQueue());
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleAction = async (
    row: AdminApprovalRow,
    status: "approved" | "needs_changes"
  ) => {
    setPendingActionId(`${row.id}:${status}`);
    setError("");

    try {
      await setAdminApprovalStatus(
        {
          approvalTargetType: row.approvalTargetType,
          approvalTargetId: row.approvalTargetId,
        },
        status
      );
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
        description="Review only vendor stores and affiliate profiles that are actually ready for admin approval."
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
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>
                      <span className="order-status processing">{row.onboardingStatus.replaceAll("_", " ")}</span>
                    </td>
                    <td>
                      <span className="order-status processing">{row.approvalStatus}</span>
                    </td>
                    <td className="ops-actions-cell">
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
                        onClick={() => void handleAction(row, "needs_changes")}
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
    </>
  );
}
