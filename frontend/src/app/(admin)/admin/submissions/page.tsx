"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { listAdminSubmissions, setAdminSubmissionStatus } from "@/lib/api/admin";
import type { VendorSubmission } from "@/types/operations";

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<VendorSubmission[]>([]);

  const refresh = async () => setRows(await listAdminSubmissions());

  useEffect(() => {
    void listAdminSubmissions().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Submission Review" description="Review vendor submissions for catalog migration pipeline." />
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Title</th><th>Category</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.title}</td>
                  <td>{row.category}</td>
                  <td>{row.notes}</td>
                  <td><span className={`order-status ${row.status === "accepted" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button size="sm" onClick={async () => { await setAdminSubmissionStatus(row.id, "accepted"); refresh(); }}>Accept to Catalog</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await setAdminSubmissionStatus(row.id, "rejected"); refresh(); }}>Reject</Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
    </>
  );
}
