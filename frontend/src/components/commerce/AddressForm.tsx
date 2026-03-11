"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import type { Address } from "@/types/purchase";

const blankAddress: Address = {
  id: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export const AddressForm = ({
  initial,
  onSave,
}: {
  initial?: Address;
  onSave: (address: Address) => Promise<void>;
}) => {
  const [form, setForm] = useState<Address>(initial ?? blankAddress);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const update = (key: keyof Address, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.zipCode || !form.country) {
      setError("Please fill in all required address fields.");
      return;
    }

    setSaving(true);
    setError("");

    await onSave(form);

    setSaving(false);
    if (!initial) setForm(blankAddress);
  };

  return (
    <form className="address-form" onSubmit={submit}>
      <div className="form-grid">
        <input placeholder="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input placeholder="Address line 1" value={form.line1} onChange={(e) => update("line1", e.target.value)} />
        <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => update("line2", e.target.value)} />
        <input placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
        <input placeholder="State/Region" value={form.state} onChange={(e) => update("state", e.target.value)} />
        <input placeholder="ZIP code" value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} />
        <input placeholder="Country" value={form.country} onChange={(e) => update("country", e.target.value)} />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <Button disabled={saving}>{saving ? "Saving..." : initial ? "Update address" : "Save address"}</Button>
    </form>
  );
};
