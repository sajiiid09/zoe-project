"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { getOrderById } from "@/lib/api/orders";
import type { CustomerOrder } from "@/types/purchase";

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (!params.id) return;
    void getOrderById(params.id).then(setOrder);
  }, [params.id]);

  return (
    <AppContainer>
      <PageIntro title="Order confirmed" description="Thank you for shopping with Zoe Market." crumbs={[{ label: "Home", href: "/" }, { label: "Order confirmation" }]} />
      <section className="confirmation-box">
        <h2>Success! Your order has been placed.</h2>
        <p>We&apos;ve received your order and started processing it.</p>
        {order ? (
          <>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total paid:</strong> ${order.pricing.total.toFixed(2)}</p>
            <p><strong>Delivery to:</strong> {order.address.fullName}, {order.address.city}</p>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
        <div className="confirmation-actions">
          <Link href="/account/orders" className="checkout-link-btn">View my orders</Link>
          <Link href="/search" className="chip">Continue shopping</Link>
        </div>
      </section>
    </AppContainer>
  );
}
