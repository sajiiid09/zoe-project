"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { listOrders } from "@/lib/api/orders";
import type { CustomerOrder } from "@/types/purchase";

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    void listOrders().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Order Management" description="Operational view of marketplace orders for support and oversight." />
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead><tr><th>Order ID</th><th>Placed</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{new Date(row.placedAt).toLocaleString()}</td>
                <td>{row.items.length}</td>
                <td>${row.pricing.total.toFixed(2)}</td>
                <td><span className={`order-status ${row.status === "delivered" ? "delivered" : row.status === "cancelled" ? "cancelled" : "processing"}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length ? <p className="muted">No orders available yet.</p> : null}
    </>
  );
}
