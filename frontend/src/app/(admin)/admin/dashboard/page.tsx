"use client";

import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { getAdminDashboardStats } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, pendingApprovals: 0, pendingSubmissions: 0, orders: 0 });

  useEffect(() => {
    void getAdminDashboardStats().then(setStats);
  }, []);

  return (
    <>
      <PageIntro title="Admin Dashboard" description="Marketplace operations overview across users, approvals, submissions, and orders." />
      <section className="ops-stats-grid">
        <article><h3>{stats.users}</h3><p>Total users</p></article>
        <article><h3>{stats.pendingApprovals}</h3><p>Pending approvals</p></article>
        <article><h3>{stats.pendingSubmissions}</h3><p>Pending submissions</p></article>
        <article><h3>{stats.orders}</h3><p>Total orders</p></article>
      </section>
    </>
  );
}
