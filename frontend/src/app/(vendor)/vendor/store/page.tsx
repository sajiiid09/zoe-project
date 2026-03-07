"use client";

import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { getVendorStore, saveVendorStore } from "@/lib/api/vendor";
import type { VendorStore } from "@/types/operations";

const blank: VendorStore = { id: "", name: "", description: "", supportEmail: "" };

export default function VendorStorePage() {
  const [form, setForm] = useState<VendorStore>(blank);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getVendorStore().then((store) => {
      if (store) setForm(store);
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.supportEmail) {
      setMessage("Store name and support email are required.");
      return;
    }
    setSaving(true);
    const saved = await saveVendorStore({ ...form, id: form.id || `vs-${Date.now()}` });
    setForm(saved);
    setMessage("Store profile saved.");
    setSaving(false);
  };

  return (
    <>
      <PageIntro title="Store Management" description="Create and maintain your vendor storefront details." />
      <form className="address-form" onSubmit={submit}>
        <div className="form-grid">
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Store name" />
          <input type="email" value={form.supportEmail} onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))} placeholder="Support email" />
          <input value={form.id} disabled placeholder="Store ID" />
          <input value="Marketplace vendor" disabled />
        </div>
        <textarea className="ops-textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Store description" />
        {message ? <p className="muted">{message}</p> : null}
        <Button disabled={saving}>{saving ? "Saving..." : "Save store details"}</Button>
      </form>
    </>
  );
}
