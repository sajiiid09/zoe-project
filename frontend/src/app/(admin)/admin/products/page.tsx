"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MediaGallery } from "@/components/ops/MediaGallery";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
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
  const [activeRow, setActiveRow] = useState<VendorProduct | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const refresh = async () => setRows(await listAdminProducts());

  useEffect(() => {
    void refresh();
  }, []);

  const openDrawer = (row: VendorProduct) => {
    setActiveRow(row);
    setRejectReason(row.rejectionNote ?? "");
    setError("");
  };

  const closeDrawer = () => {
    setActiveRow(null);
    setRejectReason("");
  };

  const handleAction = async (
    row: VendorProduct,
    status: VendorProduct["status"],
    reason?: string
  ) => {
    setPendingActionId(`${row.id}:${status}`);
    setError("");

    try {
      await setAdminProductStatus(row.id, status, reason);
      closeDrawer();
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
      <PageIntro
        title="Product Review"
        description="Approve or reject vendor products with the richer description and media context the backend already supports."
      />
      <MotionSection className="ops-panel" delay={0.03}>
        {error ? <p className="form-error admin-inline-error">{error}</p> : null}
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>
                    <div>{row.title}</div>
                    {row.description ? (
                      <small className="muted vendor-table-copy">{row.description}</small>
                    ) : null}
                  </td>
                  <td>{row.category}</td>
                  <td>{row.vendorName || row.storeName || "Unknown vendor"}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td>
                    <span className={`order-status ${row.status === "approved" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="ops-actions-cell">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingActionId !== null}
                      onClick={() => openDrawer(row)}
                    >
                      Review
                    </Button>
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
                      onClick={() =>
                        void handleAction(
                          row,
                          "rejected",
                          row.rejectionNote ?? "Rejected by admin"
                        )
                      }
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

      <Drawer
        open={activeRow !== null}
        onClose={closeDrawer}
        title="Review product"
      >
        {activeRow ? (
          <div className="admin-review-drawer">
            <div className="admin-review-section">
              <span className="admin-review-kicker">product</span>
              <h3>{activeRow.title}</h3>
              <p className="muted">{activeRow.vendorName || activeRow.storeName || "Unknown vendor"}</p>
            </div>

            <div className="admin-review-metrics">
              <article>
                <span>Price</span>
                <strong>${activeRow.price.toFixed(2)}</strong>
              </article>
              <article>
                <span>Stock</span>
                <strong>{activeRow.stock}</strong>
              </article>
            </div>

            <div className="admin-review-details">
              <div>
                <span>Category</span>
                <strong>{activeRow.category}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{activeRow.status}</strong>
              </div>
              <div>
                <span>Store</span>
                <strong>{activeRow.storeName || "Not available"}</strong>
              </div>
            </div>

            <div className="admin-review-copy">
              <span>Description</span>
              <p>{activeRow.description || "No description provided."}</p>
            </div>

            <MediaGallery
              title="Product images"
              images={activeRow.images}
              emptyLabel="No product images provided"
            />

            <label className="field" htmlFor="product-reject-reason">
              <span className="field-label">Reject reason</span>
              <textarea
                id="product-reject-reason"
                className="field-input vendor-textarea vendor-textarea-compact"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Explain what must change before this product can be approved."
              />
            </label>

            <div className="ops-actions-cell">
              <Button
                type="button"
                disabled={pendingActionId !== null}
                onClick={() => void handleAction(activeRow, "approved")}
              >
                {pendingActionId === `${activeRow.id}:approved` ? "Approving..." : "Approve"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pendingActionId !== null}
                onClick={() =>
                  void handleAction(
                    activeRow,
                    "rejected",
                    rejectReason || "Rejected by admin"
                  )
                }
              >
                {pendingActionId === `${activeRow.id}:rejected` ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
