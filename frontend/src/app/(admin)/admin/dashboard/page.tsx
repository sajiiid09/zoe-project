"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StatusBars, SparkAreaChart } from "@/components/ops/Charts";
import { MotionCard, MotionSection } from "@/components/ops/Motion";
import { PageIntro } from "@/components/layout/PageIntro";
import {
  buildAdminSnapshots,
  buildRevenueSummary,
  buildRevenueTrend,
  buildStatusBreakdown,
  sumRevenue,
} from "@/lib/analytics/admin";
import {
  getAdminDashboardStats,
  listAdminCatalog,
  listAdminProducts,
  listAdminSubmissions,
  listAdminUsers,
} from "@/lib/api/admin";
import { listOrders } from "@/lib/api/orders";
import type { RevenuePoint, SnapshotCardModel, StatusBreakdownItem } from "@/types/analytics";

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    pendingApprovals: 0,
    pendingSubmissions: 0,
    orders: 0,
    grossRevenue: 0,
    completedRevenue: 0,
    averageOrderValue: 0,
  });
  const [trend, setTrend] = useState<RevenuePoint[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownItem[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotCardModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const [baseStats, orders, users, products, submissions, catalog] = await Promise.all([
        getAdminDashboardStats(),
        listOrders(),
        listAdminUsers(),
        listAdminProducts(),
        listAdminSubmissions(),
        listAdminCatalog(),
      ]);

      if (!mounted) return;

      const revenueSummary = buildRevenueSummary(orders);
      const pendingSubmissionCount = submissions.filter((submission) => submission.status === "pending").length;

      setStats({
        users: baseStats.users || users.length,
        pendingApprovals: baseStats.pendingApprovals,
        pendingSubmissions: baseStats.pendingSubmissions || pendingSubmissionCount,
        orders: baseStats.orders || orders.length,
        grossRevenue: revenueSummary.gross,
        completedRevenue: revenueSummary.completed,
        averageOrderValue: revenueSummary.averageOrderValue,
      });

      setTrend(buildRevenueTrend(orders, 10));
      setStatusBreakdown(buildStatusBreakdown(orders));
      setSnapshots(
        buildAdminSnapshots({
          users: baseStats.users || users.length,
          pendingApprovals: baseStats.pendingApprovals,
          pendingSubmissions: baseStats.pendingSubmissions || pendingSubmissionCount,
          orders: baseStats.orders || orders.length,
          products: products.length,
          catalog: catalog.length,
          grossRevenue: sumRevenue(orders),
        })
      );
      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <PageIntro
        title="Admin Dashboard"
        description="Marketplace operations overview with polished analytics and quick snapshots across all admin tabs."
        rightSlot={<Link className="chip" href="/admin/revenue">Open revenue analytics</Link>}
      />

      <MotionSection className="ops-kpi-grid" delay={0.02}>
        <MotionCard className="ops-kpi-card" delay={0.04}>
          <p>Total users</p>
          <h3>{stats.users}</h3>
          <span>Accounts across all roles</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.07}>
          <p>Pending approvals</p>
          <h3>{stats.pendingApprovals}</h3>
          <span>Vendor + affiliate actions</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.1}>
          <p>Gross revenue</p>
          <h3>{money(stats.grossRevenue)}</h3>
          <span>All orders combined</span>
        </MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.13}>
          <p>Average order value</p>
          <h3>{money(stats.averageOrderValue)}</h3>
          <span>Completed + in-progress mix</span>
        </MotionCard>
      </MotionSection>

      <MotionSection className="ops-snapshot-grid" delay={0.08}>
        {snapshots.map((item, index) => (
          <Link href={item.href} key={item.title} className="ops-snapshot-card" style={{ transitionDelay: `${index * 40}ms` }}>
            <h4>{item.title}</h4>
            <p>{item.value}</p>
            <span>{item.hint}</span>
          </Link>
        ))}
      </MotionSection>

      <MotionSection className="ops-analytics-grid" delay={0.13}>
        <article className="ops-panel chart-panel">
          <header>
            <h2>Revenue trend</h2>
            <p>Last 10 days</p>
          </header>
          <SparkAreaChart points={trend} />
          {!trend.some((point) => point.value > 0) ? (
            <p className="muted">No transactions available yet. Revenue visuals will auto-populate once orders are placed.</p>
          ) : null}
        </article>

        <article className="ops-panel">
          <header>
            <h2>Order pipeline</h2>
            <p>Status distribution snapshot</p>
          </header>
          <StatusBars rows={statusBreakdown} />
          {loading ? <p className="muted">Loading operational metrics...</p> : null}
          <div className="ops-inline-metrics">
            <div>
              <small>Completed revenue</small>
              <strong>{money(stats.completedRevenue)}</strong>
            </div>
            <div>
              <small>Pending submissions</small>
              <strong>{stats.pendingSubmissions}</strong>
            </div>
            <div>
              <small>Total orders</small>
              <strong>{stats.orders}</strong>
            </div>
          </div>
        </article>
      </MotionSection>
    </>
  );
}
