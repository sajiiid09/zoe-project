"use client";

import { useEffect, useState } from "react";

import { AddressForm } from "@/components/commerce/AddressForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { deleteAddress, listAddresses, saveAddress } from "@/lib/api/addresses";
import type { Address } from "@/types/purchase";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = async () => {
    setAddresses(await listAddresses());
  };

  useEffect(() => {
    void listAddresses().then((result) => setAddresses(result));
  }, []);

  return (
    <>
      <PageIntro title="Addresses" description="Manage saved delivery addresses used in checkout." />
      <section className="checkout-step">
        <header>
          <h2>Saved addresses</h2>
          <Button size="sm" variant="secondary" onClick={() => { setEditing(null); setShowForm((prev) => !prev); }}>
            {showForm ? "Close" : "Add address"}
          </Button>
        </header>

        {addresses.length ? (
          <div className="address-list">
            {addresses.map((address) => (
              <article key={address.id} className="address-card static">
                <div>
                  <strong>{address.fullName}</strong>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country} • {address.phone}</p>
                </div>
                <div className="address-actions">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(address); setShowForm(true); }}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await deleteAddress(address.id); refresh(); }}>Remove</Button>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="muted">No addresses saved yet.</p>}

        {showForm ? (
          <AddressForm
            initial={editing ?? undefined}
            onSave={async (address) => {
              await saveAddress(address);
              await refresh();
              setEditing(null);
              setShowForm(false);
            }}
          />
        ) : null}
      </section>
    </>
  );
}
