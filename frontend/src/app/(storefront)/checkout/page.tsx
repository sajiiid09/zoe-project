"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AddressForm } from "@/components/commerce/AddressForm";
import { useCart } from "@/components/commerce/CartProvider";
import { OrderSummary } from "@/components/commerce/OrderSummary";
import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { SupportLinks } from "@/components/support/SupportLinks";
import { Button } from "@/components/ui/Button";
import { listAddresses, saveAddress } from "@/lib/api/addresses";
import { placeOrder } from "@/lib/api/orders";
import type { Address } from "@/types/purchase";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, pricing, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listAddresses().then((result) => {
      setAddresses(result);
      if (result[0]) setSelectedAddressId(result[0].id);
    });
  }, []);

  const selectedAddress = addresses.find((item) => item.id === selectedAddressId);

  const onSaveAddress = async (address: Address) => {
    await saveAddress(address);
    const latest = await listAddresses();
    setAddresses(latest);
    setSelectedAddressId(address.id);
    setShowAddressForm(false);
  };

  const onPlaceOrder = async () => {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!selectedAddress) {
      setError("Please select or add a delivery address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await placeOrder({ items, pricing, address: selectedAddress });
      clearCart();
      router.push(`/order/confirmation/${order.id}`);
    } catch {
      setError("Could not place your order right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppContainer>
      <PageIntro title="Checkout" description="Secure checkout with clear steps and pricing." crumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />

      {!items.length ? (
        <section className="state-box">
          <h2>No items to checkout</h2>
          <p>Your cart is empty. Add products to continue.</p>
          <Link href="/search" className="hero-cta">Go to search</Link>
        </section>
      ) : (
        <section className="purchase-layout">
          <div className="checkout-main">
            <section className="checkout-step">
              <header>
                <h2>1. Delivery address</h2>
                <Button variant="secondary" size="sm" onClick={() => setShowAddressForm((prev) => !prev)}>
                  {showAddressForm ? "Close form" : "Add new address"}
                </Button>
              </header>
              {addresses.length ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <label key={address.id} className="address-card">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div>
                        <strong>{address.fullName}</strong>
                        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country} • {address.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="muted">No saved addresses yet. Add one below.</p>
              )}

              {showAddressForm ? <AddressForm onSave={onSaveAddress} /> : null}
            </section>

            <section className="checkout-step">
              <h2>2. Review items</h2>
              <ul className="checkout-items">
                {items.map((item) => (
                  <li key={item.product.id}>
                    <span>{item.product.title}</span>
                    <span>Qty {item.quantity}</span>
                    <strong>${(item.quantity * item.product.price.amount).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </section>

            {error ? <p className="form-error">{error}</p> : null}
          </div>

          <OrderSummary
            pricing={pricing}
            cta={
              <Button className="checkout-submit" disabled={submitting || !selectedAddress} onClick={onPlaceOrder}>
                {submitting ? "Placing order..." : "Place order"}
              </Button>
            }
          />
        </section>
      )}
          <SupportLinks />
    </AppContainer>
  );
}
