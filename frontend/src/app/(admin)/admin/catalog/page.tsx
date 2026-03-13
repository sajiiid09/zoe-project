"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  listAdminCatalog,
  readAdminErrorMessage,
  setCatalogStatus,
} from "@/lib/api/admin";
import type { CatalogItem } from "@/types/operations";

export default function AdminCatalogPage() {
  const [rows, setRows] = useState<CatalogItem[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => setRows(await listAdminCatalog());

  useEffect(() => {
    void listAdminCatalog().then(setRows);
  }, []);

  const handleAction = async (
    row: CatalogItem,
    status: CatalogItem["status"]
  ) => {
    setPendingActionId(`${row.id}:${status}`);
    setError("");

    try {
      await setCatalogStatus(row.id, status);
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not update this catalog item right now.")
      );
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <>
      <PageIntro title="Catalog Management" description="Update catalog item status for visibility governance." />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
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
                    <Button
                      size="sm"
                      disabled={pendingActionId !== null}
                      onClick={() => void handleAction(row, "active")}
                    >
                      {pendingActionId === `${row.id}:active` ? "Activating..." : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingActionId !== null}
                      onClick={() => void handleAction(row, "draft")}
                    >
                      {pendingActionId === `${row.id}:draft` ? "Saving..." : "Draft"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingActionId !== null}
                      onClick={() => void handleAction(row, "archived")}
                    >
                      {pendingActionId === `${row.id}:archived` ? "Archiving..." : "Archive"}
                    </Button>
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
