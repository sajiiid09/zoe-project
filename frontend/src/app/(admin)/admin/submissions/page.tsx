"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
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
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead><tr><th>Title</th><th>Category</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.category}</td>
                <td>{row.notes}</td>
                <td><span className={`order-status ${row.status === "accepted" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                <td>
                  <Button size="sm" onClick={async () => { await setAdminSubmissionStatus(row.id, "accepted"); refresh(); }}>Accept</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await setAdminSubmissionStatus(row.id, "rejected"); refresh(); }}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
