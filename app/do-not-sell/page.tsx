'use client';

import { useState } from 'react';

type Status = 'idle' | 'saving' | 'done' | 'error';

export default function DoNotSellPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleOptOut() {
    try {
      setStatus('saving');
      const res = await fetch('/api/ccpa/optout', { method: 'POST' });
      if (!res.ok) throw new Error('Request failed');
      setStatus('done');
      setMessage('Your preference has been saved. We will not sell/share your personal information.');
    } catch (e) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <main className="legal container" style={{ padding: '40px 0 80px', maxWidth: 720 }}>
      <h1 style={{ marginBottom: 10 }}>
        Do Not Sell or Share My Personal Information (CCPA/CPRA)
      </h1>
      <p style={{ marginBottom: 14 }}>
        You can opt out of any “sale” or “sharing” of your personal information
        as defined by California law. We don’t currently sell or share data for
        cross-context behavioral advertising, but if that changes, your choice here
        will be honored. We also respect Global Privacy Control (GPC) signals.
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn" onClick={handleOptOut} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Set “Do Not Sell/Share”'}
        </button>
        <a className="btn" href="/privacy">View Privacy Policy</a>
      </div>

      {message && (
        <p style={{ marginTop: 8, color: status === 'error' ? '#ff4d4f' : 'var(--muted)' }}>
          {message}
        </p>
      )}
    </main>
  );
}
