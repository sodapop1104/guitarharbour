'use client';

import { useEffect, useState } from 'react';

function hasCookie(name: string): boolean {
  return document.cookie.split('; ').some(c => c.startsWith(`${name}=`));
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  const secure = location.protocol === 'https:' ? 'Secure; ' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; ${secure}SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

export default function ConsentBanner() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Show banner if neither consent nor opt-out cookie exists
    if (typeof document !== 'undefined') {
      const seen = hasCookie('gh_consent') || hasCookie('gh_optout');
      setOpen(!seen);
    }
  }, []);

  async function acceptAll() {
    // Store consent for a year
    setCookie('gh_consent', 'accepted', 60 * 60 * 24 * 365);
    setOpen(false);
  }

  async function declineSharing() {
    // Hit server route to persist opt-out + cookie (and set a local cookie as a fallback)
    try {
      await fetch('/api/ccpa/optout', { method: 'POST' });
    } catch {
      // fallback local cookie for a year
      setCookie('gh_optout', '1', 60 * 60 * 24 * 365);
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy options"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        padding: '12px 16px'
      }}
    >
      <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="muted" style={{ flex: 1, minWidth: 240 }}>
          We use only essential cookies by default. You can accept additional cookies or opt out of sale/sharing.
          See our <a href="/privacy">Privacy Policy</a>.
        </span>
        <button className="btn" onClick={declineSharing} aria-label="Do Not Sell or Share">
          Do Not Sell/Share
        </button>
        <button className="btn" onClick={acceptAll} aria-label="Accept">
          Accept
        </button>
      </div>
    </div>
  );
}