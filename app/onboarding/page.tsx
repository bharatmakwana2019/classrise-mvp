"use client";

import { FormEvent, useState } from "react";

const modules = [
  ["students", "Student management"], ["attendance", "Attendance"], ["fees", "Fees & follow-ups"],
  ["timetable", "Timetable"], ["tests_results", "Tests & results"], ["content", "Teacher content"],
  ["reports", "Reports & insights"], ["communications", "Communications"],
];

type CheckoutResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type CheckoutOptions = {
  key: string; amount: number; currency: string; name: string; description: string; order_id: string;
  prefill: { email: string }; theme: { color: string }; handler: (result: CheckoutResult) => void;
  modal: { ondismiss: () => void };
};
declare global { interface Window { Razorpay?: new (options: CheckoutOptions) => { open: () => void }; } }

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    const script = existing ?? document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout could not be loaded. Please try again."));
    if (!existing) document.body.appendChild(script);
  });
}

export default function OnboardingPage() {
  const [status, setStatus] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("Preparing secure checkout...");
    setCreatedUrl("");
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/onboarding", { method: "POST", body: form });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error ?? "We could not start checkout.");
      await loadCheckout();
      if (!window.Razorpay) throw new Error("Razorpay checkout could not be loaded. Please try again.");
      setStatus("Complete payment to create your institute.");
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "gurukulOS",
        description: "Institute onboarding",
        order_id: order.orderId,
        prefill: { email: order.email },
        theme: { color: "#3d8659" },
        modal: { ondismiss: () => { setBusy(false); setStatus("Checkout closed. Your institute has not been created."); } },
        handler: async (payment) => {
          setStatus("Verifying payment and creating your institute...");
          try {
            const verification = await fetch("/api/onboarding/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ draftId: order.draftId, ...payment }),
            });
            const result = await verification.json();
            if (!verification.ok) throw new Error(result.error ?? "Payment verification failed.");
            setStatus("Payment confirmed. Your institute is ready.");
            setCreatedUrl(result.url);
          } catch (error) {
            setStatus(error instanceof Error ? error.message : "Payment was received, but onboarding could not be completed. Please contact support.");
          } finally { setBusy(false); }
        },
      });
      checkout.open();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not start checkout.");
      setBusy(false);
    }
  }

  return <main className="onboarding-page"><div className="onboarding-card"><a className="onboarding-brand" href="/">gurukulOS</a><span className="eyebrow">CREATE YOUR INSTITUTE</span><h1>Set up your institute in one clear flow.</h1><p className="onboarding-lead">Choose your workspace and starting modules. Complete secure payment to create your institute and open its portal.</p><form onSubmit={submit}><label>Institute name<input name="instituteName" placeholder="Adhyayan Tutorials" required /></label><label>Preferred subdomain<div className="subdomain-field"><input name="subdomain" placeholder="adhyayan-tutorials" pattern="[a-z0-9-]+" required /><span>.{process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN || "madlyloaded.com"}</span></div></label><label>Owner name<input name="ownerName" placeholder="Your full name" required /></label><label>Owner email<input name="ownerEmail" type="email" placeholder="you@institute.com" required /></label><label>Create owner password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><label>Confirm owner password<input name="passwordConfirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><fieldset><legend>Choose your starting modules</legend><div className="module-options">{modules.map(([value,label]) => <label key={value}><input type="checkbox" name="modules" value={value} defaultChecked />{label}</label>)}</div></fieldset><button className="green-button" type="submit" disabled={busy}>{busy ? "Please wait…" : "Continue to secure payment"}</button>{status && <p className="form-status" role="status">{status}</p>}{createdUrl && <a className="created-url" href={createdUrl}>Open your institute portal →</a>}</form><p className="onboarding-note">Use a unique password with at least 12 characters. Your institute is created only after Razorpay confirms payment. You can change modules, branches, and team access later from the Owner dashboard.</p></div></main>;
}
