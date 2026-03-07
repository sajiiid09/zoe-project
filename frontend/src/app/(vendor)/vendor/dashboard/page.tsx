"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { getVendorDashboardStats, getVendorStatus, setVendorStatusLocal } from "@/lib/api/vendor";
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

  useEffect(() => {
    void getVendorStatus().then(setStatus);
    void getVendorDashboardStats().then(setStats);
  }, []);

  return (
    <>
      <PageIntro title="Vendor Dashboard" description="Operational overview for your store, products, and submissions." />

      <section className="ops-banner">
        <p>Status: <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" ? "cancelled" : "processing"}`}>{statusText[status]}</span></p>
        {status === "payment_required" ? (
          <button type="button" className="chip" onClick={() => { setVendorStatusLocal("pending"); setStatus("pending"); }}>
            Mark onboarding payment as submitted
          </button>
        ) : null}
      </section>

      <section className="ops-stats-grid">
        <article><h3>{stats.products}</h3><p>Products</p></article>
        <article><h3>{stats.submissions}</h3><p>Submissions</p></article>
        <article><h3>{stats.pendingApprovals}</h3><p>Pending approvals</p></article>
      </section>

      {status !== "approved" ? (
        <section className="state-box">
          <h2>Vendor tools are limited until approval</h2>
          <p>You can still set up store/profile details while approval is in progress.</p>
        </section>
      ) : null}
    </>
  );
}
