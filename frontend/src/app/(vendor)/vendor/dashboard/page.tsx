"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MiniBarChart } from "@/components/ops/Charts";
import { MotionCard, MotionSection } from "@/components/ops/Motion";
import { PageIntro } from "@/components/layout/PageIntro";
import {
  getVendorDashboardStats,
  getVendorStatus,
  listVendorProducts,
  listVendorSubmissions,
  setVendorStatusLocal,
} from "@/lib/api/vendor";
import type { RevenuePoint } from "@/types/analytics";
import type { AccessStatus } from "@/types/operations";

const statusText: Record<AccessStatus, string> = {
  approved: "Approved",
  pending: "Pending review",
  blocked: "Blocked",
  payment_required: "Payment required",
};

export default function VendorDashboardPage() {
  const [status, setStatus] = useState<AccessStatus>("pending");
  const [stats, setStats] = useState({ products: 0, submissions: 0, pendingApprovals: 0 });
  const [overview, setOverview] = useState<RevenuePoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const [vendorStatus, dashboardStats, products, submissions] = await Promise.all([
        getVendorStatus(),
        getVendorDashboardStats(),
        listVendorProducts(),
        listVendorSubmissions(),
      ]);

      setStatus(vendorStatus);
      setStats(dashboardStats);
      setOverview([
        { label: "Draft", value: products.filter((item) => item.status === "draft").length },
        { label: "Pending", value: products.filter((item) => item.status === "pending").length + submissions.filter((item) => item.status === "pending").length },
        { label: "Approved", value: products.filter((item) => item.status === "approved").length },
        { label: "Rejected", value: products.filter((item) => item.status === "rejected").length + submissions.filter((item) => item.status === "rejected").length },
      ]);
    };

    void load();
  }, []);

  return (
    <>
      <PageIntro
        title="Vendor Dashboard"
        description="Operational overview for your store, products, and submissions with polished visual snapshots."
        rightSlot={<Link className="chip" href="/vendor/products">Manage products</Link>}
      />

      <MotionSection className="ops-banner ops-banner-premium" delay={0.03}>
        <p>Status: <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" ? "cancelled" : "processing"}`}>{statusText[status]}</span></p>
        {status === "payment_required" ? (
          <button type="button" className="chip" onClick={() => { setVendorStatusLocal("pending"); setStatus("pending"); }}>
            Mark onboarding payment as submitted
          </button>
        ) : null}
      </MotionSection>

      <MotionSection className="ops-kpi-grid" delay={0.06}>
        <MotionCard className="ops-kpi-card" delay={0.08}><p>Products</p><h3>{stats.products}</h3><span>Listed or drafted items</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.1}><p>Submissions</p><h3>{stats.submissions}</h3><span>Catalog migration entries</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.12}><p>Pending approvals</p><h3>{stats.pendingApprovals}</h3><span>Awaiting admin review</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.14}><p>Store readiness</p><h3>{status === "approved" ? "Live" : "In setup"}</h3><span>Control surface availability</span></MotionCard>
      </MotionSection>

      <MotionSection className="ops-analytics-grid" delay={0.1}>
        <article className="ops-panel chart-panel">
          <header>
            <h2>Catalog workflow snapshot</h2>
            <p>Current product + submission distribution</p>
          </header>
          <MiniBarChart points={overview} />
        </article>

        <article className="ops-panel">
          <header>
            <h2>Quick access</h2>
            <p>Jump to daily vendor workflows</p>
          </header>
          <div className="ops-snapshot-grid ops-snapshot-grid-compact">
            <Link href="/vendor/store" className="ops-snapshot-card"><h4>Store</h4><p>Profile</p><span>Brand details</span></Link>
            <Link href="/vendor/products" className="ops-snapshot-card"><h4>Products</h4><p>{stats.products}</p><span>Catalog control</span></Link>
            <Link href="/vendor/submissions" className="ops-snapshot-card"><h4>Submissions</h4><p>{stats.submissions}</p><span>Review pipeline</span></Link>
          </div>
        </article>
      </MotionSection>

      {status !== "approved" ? (
        <section className="state-box">
          <h2>Vendor tools are limited until approval</h2>
          <p>You can still set up store/profile details while approval is in progress.</p>
        </section>
      ) : null}
    </>
  );
}
