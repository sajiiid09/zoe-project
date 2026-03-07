"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { listAdminUsers, setAdminUserStatus } from "@/lib/api/admin";
import type { AdminUserRow } from "@/types/operations";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);

  const refresh = async () => setRows(await listAdminUsers());

  useEffect(() => {
    void listAdminUsers().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Users" description="Manage user statuses across marketplace roles." />
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td><span className={`order-status ${row.status === "approved" ? "delivered" : row.status === "blocked" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                <td>
                  {row.status === "blocked" ? (
                    <Button size="sm" onClick={async () => { await setAdminUserStatus(row.id, "approved"); refresh(); }}>Unblock</Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={async () => { await setAdminUserStatus(row.id, "blocked"); refresh(); }}>Block</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
