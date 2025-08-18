'use client';

import { useEffect, useMemo, useState } from 'react';

export default function Page() {
  const viewerTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', notes: '' });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?date=${date}&viewerTz=${encodeURIComponent(viewerTz)}`)
      .then(r => r.json())
      .then(d => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, [date, viewerTz]);

  async function requestSlot(startISO: string) {
    const res = await fetch('/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startISO, ...form }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.message || 'That time was taken—please pick another slot.');
      return;
    }
    const j = await res.json().catch(() => ({}));
    if (j.approveUrl && process.env.NODE_ENV !== 'production') {
      console.log('DEV: Approve link', j.approveUrl);
      console.log('DEV: Decline link', j.declineUrl);
    }
    alert('Request sent! Check your email for confirmation once approved.');
  }

  return (
    <main className="container" style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Request a consultation</h1>

      <label style={{ display: 'block', margin: '1rem 0' }}>
        Date:{' '}
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>

      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <h2>Available times</h2>
      {loading ? (
        <p>Loading…</p>
      ) : slots.length ? (
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          {slots.map(s => (
            <li key={s}>
              <button onClick={() => requestSlot(s)} style={{ width: '100%', padding: '0.6rem 0.8rem' }}>
                {new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No slots for this day.</p>
      )}
    </main>
  );
}