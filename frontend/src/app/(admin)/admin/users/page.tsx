"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  listAdminUsers,
  readAdminErrorMessage,
  setAdminAccountActive,
} from "@/lib/api/admin";
import type { AdminUserRow } from "@/types/operations";

const formatStatusLabel = (value: string) => value.replaceAll("_", " ");

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    setRows(await listAdminUsers());
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleAccountToggle = async (row: AdminUserRow, nextActive: boolean) => {
    setPendingUserId(row.id);
    setError("");

    try {
      await setAdminAccountActive(row.id, nextActive);
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not update this account right now.")
      );
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <>
      <PageIntro
        title="Users"
        description="Manage account activation separately from vendor and affiliate onboarding approval."
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
                <th>Account</th>
                <th>Onboarding</th>
                <th>Approval</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isBlocked = row.accountStatus === "blocked";
                const buttonLabel = isBlocked ? "Unblock" : "Block";
                return (
                  <MotionTableRow key={row.id} delay={index * 0.018}>
                    <td>
                      <div>{row.name}</div>
                      {row.approvalNote ? (
                        <small className="muted">{row.approvalNote}</small>
                      ) : null}
                    </td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>
                      <span className={`order-status ${isBlocked ? "cancelled" : "delivered"}`}>
                        {row.accountStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`order-status ${row.onboardingStatus === "approved" ? "delivered" : row.onboardingStatus === "needs_changes" ? "cancelled" : row.onboardingStatus === "payment_required" ? "cancelled" : "processing"}`}>
                        {formatStatusLabel(row.onboardingStatus)}
                      </span>
                    </td>
                    <td>
                      <span className={`order-status ${row.approvalStatus === "approved" ? "delivered" : row.approvalStatus === "needs_changes" ? "cancelled" : "processing"}`}>
                        {formatStatusLabel(row.approvalStatus)}
                      </span>
                    </td>
                    <td className="ops-actions-cell">
                      <Button
                        size="sm"
                        variant={isBlocked ? "primary" : "ghost"}
                        disabled={pendingUserId !== null}
                        onClick={() => void handleAccountToggle(row, isBlocked)}
                      >
                        {pendingUserId === row.id
                          ? isBlocked
                            ? "Unblocking..."
                            : "Blocking..."
                          : buttonLabel}
                      </Button>
                    </td>
                  </MotionTableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </MotionSection>
    </>
  );
}
