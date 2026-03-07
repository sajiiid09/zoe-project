"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { listAdminProducts, setAdminProductStatus } from "@/lib/api/admin";
import type { VendorProduct } from "@/types/operations";

export default function AdminProductsPage() {
  const [rows, setRows] = useState<VendorProduct[]>([]);

  const refresh = async () => setRows(await listAdminProducts());

  useEffect(() => {
    void listAdminProducts().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Product Review" description="Approve, reject, or keep products pending for marketplace visibility." />
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.category}</td>
                <td>${row.price.toFixed(2)}</td>
                <td><span className={`order-status ${row.status === "approved" ? "delivered" : row.status === "rejected" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                <td>
                  <Button size="sm" onClick={async () => { await setAdminProductStatus(row.id, "approved"); refresh(); }}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await setAdminProductStatus(row.id, "rejected"); refresh(); }}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
