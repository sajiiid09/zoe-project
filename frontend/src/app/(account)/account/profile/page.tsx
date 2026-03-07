"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { PageIntro } from "@/components/layout/PageIntro";
import { SupportLinks } from "@/components/support/SupportLinks";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();
  const { session, updateProfile, logout, loading } = useAuth();

  const [fullName, setFullName] = useState(session?.user.fullName ?? "");
  const [phone, setPhone] = useState(session?.user.phone ?? "");
  const [message, setMessage] = useState("");

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const result = await updateProfile({ fullName, phone });
    setMessage(result.ok ? "Profile updated successfully." : result.error ?? "Could not update profile.");
  };

  return (
    <>
      <PageIntro title="Profile" description="Manage your personal details and account shortcuts." />

      <section className="checkout-step">
        <h2>Account details</h2>
        <form className="address-form" onSubmit={save}>
          <div className="form-grid">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
            <input value={session?.user.email ?? ""} disabled aria-label="Email" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <input value={session?.user.role ?? "customer"} disabled aria-label="Role" />
          </div>
          {message ? <p className="muted">{message}</p> : null}
          <div className="profile-actions">
            <Button disabled={loading}>{loading ? "Saving..." : "Save changes"}</Button>
            <Button type="button" variant="ghost" onClick={async () => { await logout(); router.push("/"); }}>
              Sign out
            </Button>
          </div>
        </form>
      </section>

      <section className="account-shortcuts">
        <Link href="/account/orders" className="chip">View recent orders</Link>
        <Link href="/account/addresses" className="chip">Manage addresses</Link>
        <Link href="/wishlist" className="chip">My wishlist</Link>
        <Link href="/cart" className="chip">Go to cart</Link>
      </section>
      <SupportLinks />
    </>
  );
}
