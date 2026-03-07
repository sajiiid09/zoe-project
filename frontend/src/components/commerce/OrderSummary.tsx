import type { ReactNode } from "react";

import type { CheckoutPricing } from "@/types/purchase";

const money = (value: number) => `$${value.toFixed(2)}`;

export const OrderSummary = ({ pricing, cta }: { pricing: CheckoutPricing; cta?: ReactNode }) => (
  <aside className="summary-box">
    <h2>Order summary</h2>
    <dl>
      <div><dt>Subtotal</dt><dd>{money(pricing.subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>{pricing.shipping ? money(pricing.shipping) : "Free"}</dd></div>
      <div><dt>Estimated tax</dt><dd>{money(pricing.tax)}</dd></div>
      <div className="total-row"><dt>Total</dt><dd>{money(pricing.total)}</dd></div>
    </dl>
    {cta}
    <p className="summary-note">Secure checkout with order confirmation and tracking updates.</p>
  </aside>
);
