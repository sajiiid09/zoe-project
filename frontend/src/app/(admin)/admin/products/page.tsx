"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  listAdminProducts,
  readAdminErrorMessage,
  setAdminProductStatus,
} from "@/lib/api/admin";
import type { VendorProduct } from "@/types/operations";

export default function AdminProductsPage() {
  const [rows, setRows] = useState<VendorProduct[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => setRows(await listAdminProducts());

  useEffect(() => {
    void listAdminProducts().then(setRows);
  }, []);

  const handleAction = async (
    row: VendorProduct,
    status: VendorProduct["status"]
  ) => {
    setPendingActionId(`${row.id}:${status}`);
    setError("");

    try {
      await setAdminProductStatus(row.id, status);
      await refresh();
    } catch (actionError) {
      setError(
        readAdminErrorMessage(actionError, "Could not update this product right now.")
      );
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <>
      <PageIntro title="Product Review" description="Approve, reject, or keep products pending for marketplace visibility." />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.title}</td>
                  <td>{row.category}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td><span className={`order-status ${row.status === "approved" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button
                      size="sm"
                      disabled={pendingActionId !== null}
                      onClick={() => void handleAction(row, "approved")}
                    >
                      {pendingActionId === `${row.id}:approved` ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingActionId !== null}
                      onClick={() => void handleAction(row, "rejected")}
                    >
                      {pendingActionId === `${row.id}:rejected` ? "Rejecting..." : "Reject"}
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
