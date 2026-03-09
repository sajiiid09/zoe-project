"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
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
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.title}</td>
                  <td>{row.category}</td>
                  <td><span className={`order-status ${row.status === "active" ? "delivered" : row.status === "archived" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button size="sm" onClick={async () => { await setCatalogStatus(row.id, "active"); refresh(); }}>Activate</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await setCatalogStatus(row.id, "draft"); refresh(); }}>Draft</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await setCatalogStatus(row.id, "archived"); refresh(); }}>Archive</Button>
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
