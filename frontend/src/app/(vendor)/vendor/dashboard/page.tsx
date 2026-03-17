"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MiniBarChart } from "@/components/ops/Charts";
import { MotionCard, MotionSection } from "@/components/ops/Motion";
import { PageIntro } from "@/components/layout/PageIntro";
import {
  getVendorDashboardStats,
  getVendorStatus,
  getVendorStore,
  listVendorProducts,
  listVendorSubmissions,
} from "@/lib/api/vendor";
import type { RevenuePoint } from "@/types/analytics";
import type { AccessStatus, VendorStore } from "@/types/operations";

const statusText: Record<AccessStatus, string> = {
  setup_required: "Setup required",
  payment_required: "Ready for payment",
  needs_changes: "Needs changes",
  approved: "Approved",
  pending: "Pending review",
  blocked: "Blocked",
};

export default function VendorDashboardPage() {
  const [status, setStatus] = useState<AccessStatus>("setup_required");
  const [stats, setStats] = useState({
    products: 0,
    submissions: 0,
    pendingApprovals: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [overview, setOverview] = useState<RevenuePoint[]>([]);
  const [store, setStore] = useState<VendorStore | null>(null);

  const storeFields = [
    Boolean(store?.name.trim()),
    Boolean(store?.supportEmail.trim()),
    Boolean(store?.description.trim()),
    Boolean(store?.phone.trim()),
    Boolean(store?.address.trim()),
    Boolean(store?.logo.trim()),
    Boolean(store?.banner.trim()),
  ];
  const storeCompleteness = Math.round(
    (storeFields.filter(Boolean).length / storeFields.length) * 100
  );

  useEffect(() => {
    const load = async () => {
      const vendorStatus = await getVendorStatus();
      const currentStore = await getVendorStore();

      setStatus(vendorStatus);
      setStore(currentStore);

      if (vendorStatus !== "approved") {
        setStats({
          products: 0,
          submissions: 0,
          pendingApprovals: vendorStatus === "pending" ? 1 : 0,
          approvedProducts: 0,
          rejectedProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
        });
        setOverview([
          { label: "Setup", value: currentStore ? 1 : 0 },
          { label: "Payment", value: vendorStatus === "payment_required" ? 1 : 0 },
          { label: "Review", value: vendorStatus === "pending" ? 1 : 0 },
          { label: "Changes", value: vendorStatus === "needs_changes" ? 1 : 0 },
        ]);
        return;
      }

      const [dashboardStats, products, submissions] = await Promise.all([
        getVendorDashboardStats(),
        listVendorProducts(),
        listVendorSubmissions(),
      ]);

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

  const rightSlot =
    status === "approved" ? (
      <Link className="chip" href="/vendor/products">Manage products</Link>
    ) : (
      <Link className="chip" href="/vendor/store">
        {store ? "Review store setup" : "Start store setup"}
      </Link>
    );

  const bannerAction =
    status === "setup_required" ? (
      <Link className="chip" href="/vendor/store">
        {store ? "Continue store setup" : "Open store setup"}
      </Link>
    ) : status === "payment_required" ? (
      <Link className="chip" href="/vendor-payment">
        Pay to submit for review
      </Link>
    ) : status === "needs_changes" ? (
      <Link className="chip" href="/vendor/store">
        Update store and resubmit
      </Link>
    ) : null;

  return (
    <>
      <PageIntro
        title="Vendor Dashboard"
        description="Track onboarding progress and unlock the rest of the vendor workspace once your store is approved."
        rightSlot={rightSlot}
      />

      <MotionSection className="ops-banner ops-banner-premium" delay={0.03}>
        <p>Status: <span className={`order-status ${status === "approved" ? "delivered" : status === "payment_required" || status === "needs_changes" ? "cancelled" : "processing"}`}>{statusText[status]}</span></p>
        {bannerAction}
      </MotionSection>

      {store?.rejectionNote ? (
        <MotionSection className="store-status-banner store-status-banner-critical" delay={0.045}>
          <div>
            <strong>Admin feedback</strong>
            <p>{store.rejectionNote}</p>
          </div>
          <Link className="chip" href="/vendor/store">
            Update store profile
          </Link>
        </MotionSection>
      ) : null}

      <MotionSection className="ops-kpi-grid" delay={0.06}>
        <MotionCard className="ops-kpi-card" delay={0.08}><p>Products</p><h3>{stats.products}</h3><span>Listed or drafted items</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.1}><p>Submissions</p><h3>{stats.submissions}</h3><span>Catalog migration entries</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.12}><p>Pending approvals</p><h3>{stats.pendingApprovals}</h3><span>Awaiting admin review</span></MotionCard>
        <MotionCard className="ops-kpi-card" delay={0.14}><p>Store completeness</p><h3>{storeCompleteness}%</h3><span>{status === "approved" ? "Live and editable" : "Improves profile quality"}</span></MotionCard>
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
            <Link href="/vendor/store" className="ops-snapshot-card"><h4>Store</h4><p>{store?.name || "Setup"}</p><span>{storeCompleteness}% complete</span></Link>
            {status === "approved" ? <Link href="/vendor/products" className="ops-snapshot-card"><h4>Products</h4><p>{stats.products}</p><span>{stats.approvedProducts} approved</span></Link> : null}
            {status === "approved" ? <Link href="/vendor/submissions" className="ops-snapshot-card"><h4>Submissions</h4><p>{stats.submissions}</p><span>{stats.pendingApprovals} in review flow</span></Link> : null}
            {status === "approved" ? <div className="ops-snapshot-card"><h4>Revenue</h4><p>${stats.totalRevenue.toFixed(2)}</p><span>{stats.totalOrders} backend-tracked orders</span></div> : null}
          </div>
        </article>
      </MotionSection>

      {status !== "approved" ? (
        <section className="state-box">
          <h2>Vendor tools unlock after onboarding approval</h2>
          <p>
            {status === "setup_required"
              ? "Complete your store details first. Once the form is ready, you can pay the onboarding fee and submit it for admin review."
              : status === "payment_required"
                ? "Your store details are ready. Complete the one-time onboarding payment to submit the request for admin review."
                : status === "needs_changes"
                  ? "Admin requested changes to your store details. Update the form and save again to resubmit."
                  : "Your store has been submitted and is waiting for admin review."}
          </p>
        </section>
      ) : null}
    </>
  );
}
