'use client';

import { useEffect, useMemo, useState } from "react";

export default function DoNotSellPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const gpc = useMemo(
    () => (typeof navigator !== "undefined" && (navigator as any).globalPrivacyControl) || false,
    []
  );

  useEffect(() => {
    if (gpc) {
      setMsg(
        "Global Privacy Control (GPC) is enabled in your browser. We will treat this as a Do Not Sell/Share signal."
      );
    }
  }, [gpc]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/ccpa/optout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() || undefined, reason: "user_opt_out" }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) setMsg("Saved. We set your opt-out preference on this browser and notified the site owner.");
    else setMsg(j?.message || "Something went wrong. Please try again.");
  }

  return (
    <main className="bp-wrap" style={{ maxWidth: 720 }}>
      <h1 className="bp-title">Do Not Sell or Share My Personal Information</h1>
      <p className="bp-subtitle" style={{ marginBottom: 12 }}>
        For California (CPRA/CCPA) and similar laws.
      </p>

      {gpc ? (
        <div className="bp-badge" style={{ display: "inline-block", marginBottom: 12 }}>
          GPC detected: opt-out respected
        </div>
      ) : null}

      <p>
        Clicking the button below sets a browser cookie to opt you out of “sale” or “sharing” of personal information
        for cross-context behavioral advertising. You can also optionally provide your email so we can record your request.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <input
          className="bp-input"
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputMode="email"
          autoComplete="email"
        />
        <button className="bp-slot" type="submit" style={{ textAlign: "center" }}>
          Opt out of sale/sharing on this browser
        </button>
      </form>

      {msg ? <p className="bp-help" style={{ marginTop: 12 }}>{msg}</p> : null}

      <p className="bp-help" style={{ marginTop: 24 }}>
        Tip: You can also enable the{" "}
        <a href="https://globalprivacycontrol.org/" target="_blank" rel="noreferrer">Global Privacy Control</a>{" "}
        setting in supported browsers. We honor that signal automatically.
      </p>
    </main>
  );
}