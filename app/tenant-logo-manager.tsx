"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function TenantLogoManager({ instituteName, logoUrl }: { instituteName: string; logoUrl: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("logo");
    if (!(file instanceof File) || !file.size) {
      setMessage("Choose a PNG or JPEG image first.");
      return;
    }
    setBusy(true);
    setMessage("Uploading logo…");
    try {
      const response = await fetch("/api/tenant/logo", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Logo upload failed.");
      form.reset();
      setMessage("Logo updated.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Logo upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removeLogo() {
    setBusy(true);
    setMessage("Removing logo…");
    try {
      const response = await fetch("/api/tenant/logo", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Logo could not be removed.");
      setMessage("Logo removed.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Logo could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="tenant-logo-settings" aria-labelledby="tenant-logo-heading">
    <div className="tenant-logo-heading-row">
      <div><span className="eyebrow">BRAND YOUR PORTAL</span><h2 id="tenant-logo-heading">Institute logo</h2></div>
      {logoUrl ? <img className="tenant-logo-preview" src={logoUrl} alt={`${instituteName} logo preview`} /> : <div className="tenant-logo-placeholder" aria-hidden="true">{instituteName.slice(0, 1).toUpperCase()}</div>}
    </div>
    <p>Use a PNG or JPEG, up to 512 KB. The image can be up to 4096 × 4096 pixels.</p>
    <form onSubmit={upload} className="tenant-logo-form">
      <label htmlFor="tenant-logo-file">Choose a logo</label>
      <input id="tenant-logo-file" name="logo" type="file" accept="image/png,image/jpeg" required disabled={busy} />
      <div className="tenant-logo-actions">
        <button className="green-button" type="submit" disabled={busy}>{busy ? "Please wait…" : "Upload logo"}</button>
        {logoUrl && <button className="tenant-logo-remove" type="button" onClick={removeLogo} disabled={busy}>Remove logo</button>}
      </div>
      {message && <p className="tenant-logo-status" role="status">{message}</p>}
    </form>
  </section>;
}
