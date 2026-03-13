"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import {
  deleteVendorProduct,
  getVendorStatus,
  listVendorProducts,
  saveVendorProduct,
} from "@/lib/api/vendor";
import type { VendorProduct } from "@/types/operations";

const blank: VendorProduct = { id: "", title: "", price: 0, stock: 0, category: "", status: "draft" };

export default function VendorProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<VendorProduct[]>([]);
  const [form, setForm] = useState<VendorProduct>(blank);
  const [allowed, setAllowed] = useState(false);

  const refresh = async () => setItems(await listVendorProducts());

  useEffect(() => {
    const load = async () => {
      const status = await getVendorStatus();
      if (status !== "approved") {
        router.replace("/vendor/dashboard");
        return;
      }

      setAllowed(true);
      setItems(await listVendorProducts());
    };

    void load();
  }, [router]);

  if (!allowed) {
    return null;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.category || form.price <= 0) return;
    await saveVendorProduct({ ...form, status: form.status || "draft" });
    setForm(blank);
    await refresh();
  };

  return (
    <>
      <PageIntro title="Product Management" description="Create, update, and control your legacy storefront products." />

      <MotionSection className="ops-panel" delay={0.03}>
        <form className="ops-form" onSubmit={submit}>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Product title" />
          <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" />
          <input type="number" value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} placeholder="Price" />
          <input type="number" value={form.stock || ""} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} placeholder="Stock" />
          <Button>{form.id ? "Update" : "Create product"}</Button>
        </form>
      </MotionSection>

      <MotionSection className="ops-panel" delay={0.08}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <MotionTableRow key={item.id} delay={index * 0.018}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td><span className={`order-status ${item.status === "approved" ? "delivered" : item.status === "rejected" ? "cancelled" : "processing"}`}>{item.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button size="sm" variant="ghost" onClick={() => setForm(item)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await deleteVendorProduct(item.id); refresh(); }}>Delete</Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
      {!items.length ? <p className="muted">No products yet. Create your first product above.</p> : null}
    </>
  );
}
