"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { listAdminUsers, setAdminUserStatus } from "@/lib/api/admin";
import type { AdminUserRow } from "@/types/operations";

export default function AdminApprovalsPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);

  const refresh = async () => setRows(await listAdminUsers());

  useEffect(() => {
    void listAdminUsers().then(setRows);
  }, []);

  const pendingRows = rows.filter((row) => (row.role === "vendor" || row.role === "affiliate") && row.status !== "approved");

  return (
    <>
      <PageIntro title="Approvals" description="Approve or reject vendor and affiliate onboarding statuses." />
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {pendingRows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td><span className="order-status processing">{row.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button size="sm" onClick={async () => { await setAdminUserStatus(row.id, "approved"); refresh(); }}>Approve</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await setAdminUserStatus(row.id, "blocked"); refresh(); }}>Reject</Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
      {!pendingRows.length ? <p className="muted">No pending approvals.</p> : null}
    </>
  );
}
