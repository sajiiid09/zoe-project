"use client";

import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { Button } from "@/components/ui/Button";
import { deleteVendorSubmission, listVendorSubmissions, saveVendorSubmission } from "@/lib/api/vendor";
import type { VendorSubmission } from "@/types/operations";

const blank: VendorSubmission = { id: "", title: "", category: "", notes: "", status: "pending" };

export default function VendorSubmissionsPage() {
  const [items, setItems] = useState<VendorSubmission[]>([]);
  const [form, setForm] = useState<VendorSubmission>(blank);

  const refresh = async () => setItems(await listVendorSubmissions());

  useEffect(() => {
    void listVendorSubmissions().then(setItems);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.category) return;
    await saveVendorSubmission({ ...form, status: form.status || "pending" });
    setForm(blank);
    await refresh();
  };

  return (
    <>
      <PageIntro title="Catalog Submissions" description="Submit new product entries for catalog review and migration flow." />
      <MotionSection className="ops-panel" delay={0.03}>
        <form className="ops-form" onSubmit={submit}>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Submission title" />
          <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" />
          <input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
          <Button>{form.id ? "Update" : "Create submission"}</Button>
        </form>
      </MotionSection>

      <MotionSection className="ops-panel" delay={0.08}>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead><tr><th>Title</th><th>Category</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <MotionTableRow key={item.id} delay={index * 0.018}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.notes}</td>
                  <td><span className={`order-status ${item.status === "accepted" ? "delivered" : item.status === "rejected" ? "cancelled" : "processing"}`}>{item.status}</span></td>
                  <td className="ops-actions-cell">
                    <Button size="sm" variant="ghost" onClick={() => setForm(item)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await deleteVendorSubmission(item.id); refresh(); }}>Delete</Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
      {!items.length ? <p className="muted">No submissions yet.</p> : null}
    </>
  );
}
