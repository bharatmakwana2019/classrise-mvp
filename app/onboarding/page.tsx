"use client";

import { FormEvent, useState } from "react";

const modules = [
  ["students", "Student management"], ["attendance", "Attendance"], ["fees", "Fees & follow-ups"],
  ["timetable", "Timetable"], ["tests_results", "Tests & results"], ["content", "Teacher content"],
  ["reports", "Reports & insights"], ["communications", "Communications"],
];

export default function OnboardingPage() {
  const [status, setStatus] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating your institute...");
    setCreatedUrl("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "We could not create the institute."); return; }
    setStatus("Institute created successfully.");
    setCreatedUrl(result.url);
  }

  return <main className="onboarding-page"><div className="onboarding-card"><a className="onboarding-brand" href="/">gurukulOS</a><span className="eyebrow">CREATE YOUR INSTITUTE</span><h1>Set up your institute in one clear flow.</h1><p className="onboarding-lead">Create your institute workspace, choose the modules you need, and invite your team when you are ready.</p><form onSubmit={submit}><label>Institute name<input name="instituteName" placeholder="Adhyayan Tutorials" required /></label><label>Preferred subdomain<div className="subdomain-field"><input name="subdomain" placeholder="adhyayan-tutorials" pattern="[a-z0-9-]+" required /><span>.madlyloaded.com</span></div></label><label>Owner name<input name="ownerName" placeholder="Your full name" required /></label><label>Owner email<input name="ownerEmail" type="email" placeholder="you@institute.com" required /></label><fieldset><legend>Choose your starting modules</legend><div className="module-options">{modules.map(([value,label]) => <label key={value}><input type="checkbox" name="modules" value={value} defaultChecked />{label}</label>)}</div></fieldset><button className="green-button" type="submit">Create my institute</button>{status && <p className="form-status">{status}</p>}{createdUrl && <a className="created-url" href={createdUrl}>Open your institute portal →</a>}</form><p className="onboarding-note">You can change modules, branches, and team access later from the Owner dashboard.</p></div></main>;
}
