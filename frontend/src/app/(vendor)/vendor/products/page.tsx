"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { MediaGallery } from "@/components/ops/MediaGallery";
import { MotionSection, MotionTableRow } from "@/components/ops/Motion";
import { UrlListField } from "@/components/ops/UrlListField";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import {
  deleteVendorProduct,
  getVendorStatus,
  listVendorProducts,
  saveVendorProduct,
} from "@/lib/api/vendor";
import type { VendorProduct } from "@/types/operations";

const blank: VendorProduct = {
  id: "",
  title: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  images: [],
  status: "draft",
};

type ProductFilter = "all" | VendorProduct["status"];

export default function VendorProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<VendorProduct[]>([]);
  const [form, setForm] = useState<VendorProduct>(blank);
  const [allowed, setAllowed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [message, setMessage] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

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

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.status === activeFilter);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.category.trim() || form.price <= 0) {
      setMessage("Title, category, and a positive price are required.");
      return;
    }

    setMessage("");
    await saveVendorProduct({ ...form, status: form.status || "draft" });
    setForm(blank);
    await refresh();
    setMessage(form.id ? "Product updated." : "Product created and sent for review.");
  };

  return (
    <>
      <PageIntro
        title="Product Management"
        description="Create review-ready products with descriptions and image URLs instead of the previous thin placeholder form."
      />

      <MotionSection className="ops-panel" delay={0.03}>
        <form className="vendor-form-shell" onSubmit={submit}>
          <section className="vendor-form-section">
            <header className="vendor-form-header">
              <h2>{form.id ? "Edit product" : "Create product"}</h2>
              <p>Upload product images from your device. Uploaded Cloudinary URLs still persist through the existing images array.</p>
            </header>
            <div className="form-grid">
              <label className="field">
                <span className="field-label">Product title</span>
                <input
                  className="field-input"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Product title"
                />
              </label>
              <label className="field">
                <span className="field-label">Category</span>
                <input
                  className="field-input"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Category"
                />
              </label>
              <label className="field">
                <span className="field-label">Price</span>
                <input
                  className="field-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price || ""}
                  onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  placeholder="99.99"
                />
              </label>
              <label className="field">
                <span className="field-label">Stock</span>
                <input
                  className="field-input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock || ""}
                  onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
                  placeholder="0"
                />
              </label>
            </div>
            <label className="field">
              <span className="field-label">Description</span>
              <textarea
                className="field-input vendor-textarea"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Add a product description that gives the admin enough context to review it."
              />
            </label>
            <UrlListField
              label="Product images"
              values={form.images}
              onChange={(images) => setForm((current) => ({ ...current, images }))}
              uploadScope="product"
              hint="Upload from device or paste approved image URLs. The first image should be the primary visual."
              onUploadingChange={setIsUploadingMedia}
            />
            {message ? <p className="muted">{message}</p> : null}
            <div className="ops-actions-cell">
              <Button disabled={isUploadingMedia}>
                {isUploadingMedia
                  ? "Wait for uploads..."
                  : form.id
                    ? "Update product"
                    : "Create product"}
              </Button>
              {form.id ? (
                <Button type="button" variant="ghost" onClick={() => setForm(blank)}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </section>
        </form>
      </MotionSection>

      <MotionSection className="ops-panel" delay={0.08}>
        <div className="tabs" role="tablist" aria-label="Product status filters">
          {["all", "pending", "approved", "rejected"].map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                className={`tab ${active ? "tab-active" : ""}`}
                aria-selected={active}
                onClick={() => setActiveFilter(filter as ProductFilter)}
              >
                {filter === "all" ? "All" : filter}
              </button>
            );
          })}
        </div>
        <div className="ops-table-wrap enhanced-table">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <MotionTableRow key={item.id} delay={index * 0.018}>
                  <td>
                    <div>{item.title}</div>
                    {item.description ? <small className="muted">{item.description}</small> : null}
                    {item.rejectionNote ? <small className="form-error">{item.rejectionNote}</small> : null}
                  </td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>
                    <span className={`order-status ${item.status === "approved" ? "delivered" : item.status === "rejected" ? "cancelled" : "processing"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="ops-actions-cell">
                    <Button size="sm" variant="ghost" onClick={() => setForm({ ...blank, ...item })}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await deleteVendorProduct(item.id);
                        await refresh();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </MotionTableRow>
              ))}
            </tbody>
          </table>
        </div>
        {filteredItems[0]?.images?.length ? (
          <MediaGallery title="Selected status media preview" images={filteredItems[0].images} />
        ) : null}
      </MotionSection>
      {!items.length ? <p className="muted">No products yet. Create your first product above.</p> : null}
    </>
  );
}
