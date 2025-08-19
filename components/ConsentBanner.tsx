'use client';

import { useEffect, useState } from "react";

const KEY = "gh_consent_v1";
type Consent = { analytics: boolean; marketing: boolean; ts: number };

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const gpc = (typeof navigator !== "undefined" && (navigator as any).globalPrivacyControl) || false;
    const saved = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!saved) {
      setOpen(true);
      if (gpc) {
        const c: Consent = { analytics: false, marketing: false, ts: Date.now() };
        localStorage.setItem(KEY, JSON.stringify(c));
        setOpen(false);
      }
    }
  }, []);

  function save(consent: Consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: "auto 12px 12px 12px", zIndex: 1000,
      background: "var(--bp-panel, #11131a)", color: "var(--bp-text, #e8eaf4)",
      border: "1px solid var(--bp-border, #232637)", borderRadius: 14, padding: 14,
      boxShadow: "0 8px 24px rgba(0,0,0,.35)"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Cookies & Privacy</div>
      <div style={{ opacity: .8, fontSize: 13, marginBottom: 10 }}>
        We use necessary cookies to run the site. We’d also like to use analytics to improve Guitar Harbour.
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="bp-slot" style={{ padding: "8px 12px" }}
          onClick={() => save({ analytics: true, marketing: false, ts: Date.now() })}>
          Accept analytics
        </button>
        <button className="bp-slot" style={{ padding: "8px 12px" }}
          onClick={() => save({ analytics: false, marketing: false, ts: Date.now() })}>
          Reject non-essential
        </button>
        <a className="bp-badge" href="/privacy" style={{ textDecoration: "none", alignSelf: "center" }}>
          Privacy Policy
        </a>
        <a className="bp-badge" href="/do-not-sell" style={{ textDecoration: "none", alignSelf: "center" }}>
          Do Not Sell/Share
        </a>
      </div>
    </div>
  );
}