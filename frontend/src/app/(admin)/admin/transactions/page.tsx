"use client";

import { useEffect, useMemo, useState } from "react";

import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { PageIntro } from "@/components/layout/PageIntro";
import { buildTransactions } from "@/lib/analytics/admin";
import { listOrders } from "@/lib/api/orders";
import type { TransactionRowView } from "@/types/analytics";
import type { OrderStatus } from "@/types/purchase";

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

const filters: Array<{ label: string; value: "all" | OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Placed", value: "placed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminTransactionsPage() {
  const [rows, setRows] = useState<TransactionRowView[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    void listOrders().then((orders) => {
      setRows(buildTransactions(orders));
    });
  }, []);

  const filteredRows = useMemo(() => {
    if (activeFilter === "all") return rows;
    return rows.filter((row) => row.status === activeFilter);
  }, [activeFilter, rows]);

  return (
    <>
      <PageIntro
        title="Transactions"
        description="Visual transaction ledger derived from marketplace orders. Backend-level payment reconciliation will be added later."
      />

      <MotionSection className="ops-panel" delay={0.03}>
        <div className="tabs" role="tablist" aria-label="Transaction filters">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                className={`tab ${active ? "tab-active" : ""}`}
                aria-selected={active}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Placed</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <MotionTableRow key={row.id} delay={index * 0.02}>
                  <td>{row.id}</td>
                  <td>{row.placedAtLabel}</td>
                  <td>{row.itemCount}</td>
                  <td>{money(row.total)}</td>
                  <td>
                    <span className={`order-status ${row.status === "delivered" ? "delivered" : row.status === "cancelled" ? "cancelled" : "processing"}`}>
                      {row.status}
                    </span>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredRows.length ? (
          <div className="state-box">
            <h2>No transactions in this segment</h2>
            <p>Transaction visuals will populate automatically when matching orders are available.</p>
          </div>
        ) : null}
      </MotionSection>
    </>
  );
}
