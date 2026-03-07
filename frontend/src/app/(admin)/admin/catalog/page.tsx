"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { listAdminCatalog, setCatalogStatus } from "@/lib/api/admin";
import type { CatalogItem } from "@/types/operations";

export default function AdminCatalogPage() {
  const [rows, setRows] = useState<CatalogItem[]>([]);

  const refresh = async () => setRows(await listAdminCatalog());

  useEffect(() => {
    void listAdminCatalog().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Catalog Management" description="Update catalog item status for visibility governance." />
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.category}</td>
                <td>{row.status}</td>
                <td>
                  <Button size="sm" onClick={async () => { await setCatalogStatus(row.id, "active"); refresh(); }}>Activate</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await setCatalogStatus(row.id, "draft"); refresh(); }}>Draft</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await setCatalogStatus(row.id, "archived"); refresh(); }}>Archive</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
