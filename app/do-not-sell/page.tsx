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
      setMessage('Preference saved. We will not sell or share your personal information.');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <main className="container" style={{ padding: '40px 0 80px', maxWidth: 720 }}>
      <h1 style={{ marginBottom: 10 }}>Do Not Sell or Share My Personal Information</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        This page lets California residents (and anyone else) set a preference that we will not sell or share their personal
        information for cross-context behavioral advertising. You can change this at any time.
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