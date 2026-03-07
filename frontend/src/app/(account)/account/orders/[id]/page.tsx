"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { cancelOrder, getOrderById } from "@/lib/api/orders";
import type { CustomerOrder } from "@/types/purchase";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (!params.id) return;
    void getOrderById(params.id).then(setOrder);
  }, [params.id]);

  const onCancel = async () => {
    if (!order) return;
    const updated = await cancelOrder(order.id);
    if (updated) setOrder(updated);
  };

  return (
    <>
      <PageIntro title="Order detail" description="Detailed order status, delivery, and items." crumbs={[{ label: "Orders", href: "/account/orders" }, { label: order?.id ?? "..." }]} />

      {!order ? (
        <p className="muted">Loading order detail...</p>
      ) : (
        <section className="checkout-step">
          <header>
            <h2>{order.id}</h2>
            {(order.status === "placed" || order.status === "processing") ? <Button size="sm" variant="ghost" onClick={onCancel}>Cancel order</Button> : null}
          </header>
          <p>Status: <strong>{order.status}</strong></p>
          <p>Placed: {new Date(order.placedAt).toLocaleString()}</p>
          <h3>Delivery address</h3>
          <p>{order.address.fullName}, {order.address.line1}, {order.address.city}</p>
          <h3>Items</h3>
          <ul className="checkout-items">
            {order.items.map((item) => (
              <li key={item.product.id}><span>{item.product.title} × {item.quantity}</span><strong>${(item.quantity * item.product.price.amount).toFixed(2)}</strong></li>
            ))}
          </ul>
          <p className="cart-price">Total paid: ${order.pricing.total.toFixed(2)}</p>
          <Link href="/account/orders" className="chip">Back to orders</Link>
        </section>
      )}
    </>
  );
}
