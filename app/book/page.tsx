'use client';

import { useEffect, useMemo, useState } from 'react';

const MEETING_MIN = 30;
const BUSINESS_TZ = process.env.NEXT_PUBLIC_BUSINESS_TZ || 'America/Los_Angeles';
const PH_TZ = process.env.NEXT_PUBLIC_PH_TZ; // optional

function formatRangeISO(startISO: string, minutes: number, tz: string) {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + minutes * 60 * 1000);
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  });
  const startStr = fmt.format(start);
  const endStr = fmt.format(end);
  const ampm = endStr.match(/\b[AP]M\b/i)?.[0] ?? '';
  const startNoMeridiem = startStr.replace(/\s?[AP]M$/i, '');
  const endNoMeridiem = endStr.replace(/\s?[AP]M$/i, '');
  return `${startNoMeridiem}–${endNoMeridiem} ${ampm}`.trim();
}
function getTzShort(tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(new Date());
  return parts.find(p => p.type === 'timeZoneName')?.value || tz;
}
function validateEmail(val: string): string | null {
  const v = val.trim();
  if (!v) return 'Email is required.';
  if (v.length > 254) return 'Email is too long.';
  const re = /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  if (!re.test(v)) return 'Enter a valid email address.';
  if (/@gmail\.con$/i.test(v)) return 'Did you mean gmail.com?';
  return null;
}

export default function Page() {
  const viewerTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  const tzShort = useMemo(() => getTzShort(viewerTz), [viewerTz]);
  const businessTzShort = useMemo(() => getTzShort(BUSINESS_TZ), []);
  const phTzShort = useMemo(() => (PH_TZ ? getTzShort(PH_TZ) : ''), []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?date=${date}&viewerTz=${encodeURIComponent(viewerTz)}`)
      .then(r => r.json())
      .then(d => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, [date, viewerTz]);

  function onEmailChange(value: string) {
    setForm({ ...form, email: value });
    if (touched.email) setEmailError(validateEmail(value));
  }
  function onEmailBlur() {
    setTouched(t => ({ ...t, email: true }));
    setEmailError(validateEmail(form.email));
  }
  const nameError = touched.name && !form.name.trim() ? 'Name is required.' : null;
  const formValid = !validateEmail(form.email) && !!form.name.trim();

  async function requestSlot(startISO: string) {
    const eErr = validateEmail(form.email);
    const nErr = !form.name.trim() ? 'Name is required.' : null;
    setEmailError(eErr);
    if (nErr || eErr) {
      if (!touched.name) setTouched(t => ({ ...t, name: true }));
      if (!touched.email) setTouched(t => ({ ...t, email: true }));
      return;
    }
    const res = await fetch('/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startISO,
        name: form.name.trim(),
        email: form.email.trim(),
        notes: form.notes.trim(),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(j?.errors?.fieldErrors?.email?.[0] || j.message || 'Please check your details.');
      return;
    }
    alert('Request sent! You’ll get a confirmation once approved.');
  }

  return (
    <main className="bp-wrap">
      <header className="bp-header">
        <div>
          <h1 className="bp-title">Request an online consultation</h1>
          <p className="bp-subtitle">
            Choose a {MEETING_MIN}-minute slot. Shown in your local time and Guitar Harbour time.
          </p>
        </div>
        <div className="bp-badges">
          <span className="bp-badge">You: {viewerTz} ({tzShort})</span>
          <span className="bp-badge">Guitar Harbour: {BUSINESS_TZ} ({businessTzShort})</span>
          {PH_TZ ? <span className="bp-badge">Manila: {PH_TZ} ({phTzShort})</span> : null}
        </div>
      </header>

      <section className="bp-panel">
        <label className="bp-label">
          <span>Date</span>
          <input
            className="bp-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <div className="bp-formGrid">
          <div>
            <label className="bp-label">
              <span>Name</span>
              <input
                className={`bp-input ${nameError ? 'bp-inputError' : ''}`}
                placeholder="Your name"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
              />
            </label>
            {nameError ? <div id="name-error" className="bp-error">{nameError}</div> : null}
          </div>

          <div>
            <label className="bp-label">
              <span>Email</span>
              <input
                className={`bp-input ${emailError ? 'bp-inputError' : ''}`}
                placeholder="you@example.com"
                type="email"
                required
                value={form.email}
                onChange={e => onEmailChange(e.target.value)}
                onBlur={onEmailBlur}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                autoComplete="email"
                inputMode="email"
                pattern="^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$"
                title="Enter a valid email address"
              />
            </label>
            {emailError ? <div id="email-error" role="alert" className="bp-error">{emailError}</div> : null}
          </div>

          <div className="bp-fullRow">
            <label className="bp-label">
              <span>Notes (optional)</span>
              <input
                className="bp-input"
                placeholder="Anything specific you want to cover?"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="bp-panel">
        <h2 className="bp-sectionTitle">Available times</h2>

        {loading ? (
          <div className="bp-skeletonGrid">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bp-skeleton" />)}
          </div>
        ) : slots.length ? (
          <>
            {!formValid && (
              <p className="bp-help">Enter your name and a valid email to enable booking.</p>
            )}
            <ul className="bp-grid">
              {slots.map(s => (
                <li key={s}>
                  <button
                    onClick={() => requestSlot(s)}
                    className="bp-slot"
                    aria-label={`Book ${formatRangeISO(s, MEETING_MIN, viewerTz)} (${tzShort})`}
                    disabled={!formValid}
                  >
                    <div className="bp-slotPrimary">
                      {formatRangeISO(s, MEETING_MIN, viewerTz)} <span className="bp-muted">({tzShort})</span>
                    </div>
                    <div className="bp-slotSecondary">
                      {formatRangeISO(s, MEETING_MIN, BUSINESS_TZ)} ({businessTzShort})
                      {PH_TZ ? <> · {formatRangeISO(s, MEETING_MIN, PH_TZ)} ({phTzShort})</> : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="bp-help">No slots for this day.</p>
        )}
      </section>
    </main>
  );
}