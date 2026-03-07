"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { cancelOrder, listOrders } from "@/lib/api/orders";
import type { CustomerOrder } from "@/types/purchase";

const statusLabel: Record<CustomerOrder["status"], string> = {
  placed: "Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    setOrders(await listOrders());
    setLoading(false);
  };

  useEffect(() => {
    void listOrders().then((result) => {
      setOrders(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageIntro title="Orders" description="Track, review, and manage your purchase history." />
      {loading ? <p className="muted">Loading orders...</p> : null}
      {!loading && !orders.length ? (
        <section className="state-box">
          <h2>No orders yet</h2>
          <p>Once you place an order, it will appear here.</p>
        </section>
      ) : null}
      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <header>
              <div>
                <h3>{order.id}</h3>
                <p>{new Date(order.placedAt).toLocaleString()}</p>
              </div>
              <span className={`order-status ${order.status}`}>{statusLabel[order.status]}</span>
            </header>
            <p>{order.items.length} items • ${order.pricing.total.toFixed(2)}</p>
            <div className="order-actions">
              <Link href={`/account/orders/${order.id}`} className="chip">View details</Link>
              {order.status === "placed" || order.status === "processing" ? (
                <Button size="sm" variant="ghost" onClick={async () => { await cancelOrder(order.id); refresh(); }}>
                  Cancel order
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
