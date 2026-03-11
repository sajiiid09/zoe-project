"use client";

import { useEffect, useMemo, useState } from "react";

import { MiniBarChart, SparkAreaChart, StatusBars } from "@/components/ops/Charts";
import { MotionCard, MotionSection } from "@/components/ops/Motion";
import { PageIntro } from "@/components/layout/PageIntro";
import {
  buildRevenueSummary,
  buildRevenueTrend,
  buildStatusBreakdown,
} from "@/lib/analytics/admin";
import { listAllOrders } from "@/lib/api/orders";
import type { RevenuePoint, StatusBreakdownItem } from "@/types/analytics";
import type { CustomerOrder } from "@/types/purchase";

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function AdminRevenuePage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [trend, setTrend] = useState<RevenuePoint[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownItem[]>([]);

  useEffect(() => {
    void listAllOrders().then((incomingOrders) => {
      setOrders(incomingOrders);
      setTrend(buildRevenueTrend(incomingOrders, 14));
      setStatusBreakdown(buildStatusBreakdown(incomingOrders));
    });
  }, []);

  const summary = useMemo(() => buildRevenueSummary(orders), [orders]);

  return (
    <>
      <PageIntro
        title="Revenue"
        description="Visual revenue intelligence derived from existing order data. Detailed finance integrations arrive in a later phase."
      />

      <MotionSection className="ops-kpi-grid" delay={0.03}>
        <MotionCard className="ops-kpi-card" delay={0.04}>
          <p>Gross revenue</p>
          <h3>{money(summary.gross)}</h3>
          <span>Total across all order statuses</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.07}>
          <p>Completed revenue</p>
          <h3>{money(summary.completed)}</h3>
          <span>Delivered + shipped orders</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.1}>
          <p>Cancelled value</p>
          <h3>{money(summary.cancelled)}</h3>
          <span>Potential recoverable revenue</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.13}>
          <p>Average order value</p>
          <h3>{money(summary.averageOrderValue)}</h3>
          <span>Based on current order book</span>
        </MotionCard>
      </MotionSection>

      <MotionSection className="ops-analytics-grid" delay={0.1}>
        <article className="ops-panel chart-panel">
          <header>
            <h2>Revenue momentum</h2>
            <p>14-day rolling trend</p>
          </header>
          <SparkAreaChart points={trend} />
        </article>

        <article className="ops-panel">
          <header>
            <h2>Daily revenue bars</h2>
            <p>Compact day-over-day view</p>
          </header>
          <MiniBarChart points={trend} />
        </article>
      </MotionSection>

      <MotionSection className="ops-panel" delay={0.15}>
        <header className="ops-panel-head">
          <h2>Revenue quality mix</h2>
          <p>Order status distribution snapshot</p>
        </header>
        <StatusBars rows={statusBreakdown} />
        {!orders.length ? (
          <p className="muted">No order data available yet. Charts and distributions will update automatically.</p>
        ) : null}
      </MotionSection>
    </>
  );
}
