"use client";

import { useEffect, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { getAffiliateProfile, saveAffiliateProfile } from "@/lib/api/affiliate";
import type { AffiliateProfile } from "@/types/operations";

const blank: AffiliateProfile = {
  id: "",
  displayName: "",
  channel: "",
  audienceRegion: "",
  status: "pending",
};

export default function AffiliateProfilePage() {
  const [form, setForm] = useState<AffiliateProfile>(blank);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getAffiliateProfile().then((profile) => {
      if (profile) setForm(profile);
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.displayName || !form.channel || !form.audienceRegion) {
      setMessage("Please complete all profile fields.");
      return;
    }
    const saved = await saveAffiliateProfile({
      ...form,
      status: form.status || "pending",
    });
    setForm(saved);
    setMessage("Affiliate profile saved.");
  };

  return (
    <>
      <PageIntro title="Affiliate Profile" description="Manage onboarding profile required for affiliate approval." />
      <form className="address-form" onSubmit={submit}>
        <div className="form-grid">
          <input value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} placeholder="Display name" />
          <input value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} placeholder="Primary channel" />
          <input value={form.audienceRegion} onChange={(e) => setForm((p) => ({ ...p, audienceRegion: e.target.value }))} placeholder="Audience region" />
          <input value={form.status} disabled />
        </div>
        {message && (
          <div style={{ padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", backgroundColor: message.includes("saved") ? "#f0fdf4" : "#fef2f2", color: message.includes("saved") ? "#166534" : "#991b1b", border: `1px solid ${message.includes("saved") ? "#bbf7d0" : "#fecaca"}`, marginTop: "0.4rem" }}>
            {message}
          </div>
        )}
        <Button style={{ marginTop: "0.25rem" }}>Save affiliate profile</Button>
      </form>
    </>
  );
}
