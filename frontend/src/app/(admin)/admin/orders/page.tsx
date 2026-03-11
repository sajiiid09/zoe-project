"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { listAllOrders } from "@/lib/api/orders";
import type { CustomerOrder } from "@/types/purchase";

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    void listAllOrders().then(setRows);
  }, []);

  return (
    <>
      <PageIntro title="Order Management" description="Operational view of marketplace orders for support and oversight." />
      <MotionSection className="ops-panel" delay={0.03}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Order ID</th><th>Placed</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.id}</td>
                  <td>{new Date(row.placedAt).toLocaleString()}</td>
                  <td>{row.items.length}</td>
                  <td>${row.pricing.total.toFixed(2)}</td>
                  <td><span className={`order-status ${row.status === "delivered" ? "delivered" : row.status === "cancelled" ? "cancelled" : "processing"}`}>{row.status}</span></td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
      {!rows.length ? <p className="muted">No orders available yet.</p> : null}
    </>
  );
}
