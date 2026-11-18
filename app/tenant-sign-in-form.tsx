"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function TenantSignInForm({ instituteName }: { instituteName: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const values = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: String(values.get("email") ?? ""),
        password: String(values.get("password") ?? ""),
        redirect: false,
      });
      if (result?.error || !result?.ok) {
        setError("The email or password was not recognized. Check your details and try again.");
        setBusy(false);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.");
      setBusy(false);
    }
  }

  return <form className="tenant-auth-fields" onSubmit={submit}>
    <label>Email address<input name="email" type="email" autoComplete="username" placeholder="you@institute.com" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
    {error && <p className="tenant-sign-in-error" role="alert">{error}</p>}
    <button type="submit" className="green-button" disabled={busy}>{busy ? "Signing in…" : `Sign in to ${instituteName}`}</button>
  </form>;
}
