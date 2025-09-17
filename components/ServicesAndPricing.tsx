// components/ServicesAndPricing.tsx
"use client";

import React, { useEffect, useState } from "react";
import GeoPrice from "./GeoPrice";

/** Robust cookie read that works if the cookie is first or later in the list */
function readCountryCode(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)country_code=([^;]+)/);
  return m ? decodeURIComponent(m[1]).toUpperCase() : "";
}

/** Synchronous on first render; updates when window regains focus */
function useIsPH() {
  const [isPH, setIsPH] = useState(() => readCountryCode() === "PH");
  useEffect(() => {
    const refresh = () => setIsPH(readCountryCode() === "PH");
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  return isPH;
}

/** Label on the left, GeoPrice on the right (for non-PH lists) */
function PriceLine(props: {
  label: React.ReactNode;
  usd?: number;
  usdRange?: [number, number];
  note?: React.ReactNode;
}) {
  const { label, usd, usdRange, note } = props;
  return (
    <li className="price-line">
      <span className="price-line__label">{label}</span>
      <span className="price-line__spacer" />
      <GeoPrice
        usd={usd}
        // @ts-ignore — allow usdRange as prop
        usdRange={usdRange}
      />
      {note ? <span className="price-line__note">{note}</span> : null}
    </li>
  );
}

export default function ServicesAndPricing() {
  const isPH = useIsPH();

  return (
    <section id="services">
      <div className="container">
        {/* Preface / value statement */}
        <div className="reveal" data-anim="up" style={{ marginBottom: 18 }}>
          <h3 className="gradient-text" style={{ margin: 0 }}>
            The Difference Is in the Details
          </h3>
          <div className="fret-divider" />
          <p className="muted" style={{ margin: 0 }}>
            Your guitar deserves more than a quick fix. With premium tools and years of experience,
            every adjustment is measured, tested, and refined—so it plays and sounds at its peak.
          </p>
        </div>

        <h2 className="reveal" data-anim="up">Services &amp; Pricing</h2>

        {/* PH-only warranty banner (shows immediately if cookie is PH) */}
        {isPH && (
          <div className="ph-warranty reveal" data-anim="up" aria-live="polite">
            PH includes <strong>3 months warranty</strong>
          </div>
        )}

        <div className="grid stagger reveal" data-anim="up">
          {/* Deep Cleaning */}
          <article className="card service-card">
            <h3 style={{ marginBottom: 6 }}>Deep Cleaning</h3>
            <div className="price-row">
              <GeoPrice usd={35} />
            </div>
            <ul className="pick-list">
              <li>A complete hardware refresh for your guitar.</li>
              <li>Disassembly, cleaning, and reassembly of bridges (Floyd Rose, Strat, 2-point tremolo)</li>
              <li>Full hardware deep clean (including tuning pegs)</li>
              <li>Fretboard reconditioning</li>
              <li>All cleaning done with MusicNomad professional tools and solutions</li>
              <li>Scratchy potentiometer, cleaning included.</li>
              <li>Available when you avail one of our setup packages.</li>
            </ul>
          </article>

          {/* Basic Setup */}
          <article className="card service-card">
            <h3 style={{ marginBottom: 6 }}>Basic Setup</h3>
            <div className="price-row">
              <GeoPrice usd={150} />
            </div>
            <ul className="pick-list">
              <li>Designed to improve your guitar’s comfort and playability.</li>
              <li>Fretboard cleaning &amp; conditioning</li>
              <li>Fretwire polish for smoother bends</li>
              <li>Nut height adjustment using gauges or custom measurements</li>
              <li>Intonation with Turbo Tuner ST-300</li>
              <li>Action adjustment (low, medium, high)</li>
              <li>Pickup height adjustment</li>
              <li>Basic body cleaning (deep clean extra)</li>
              <li>String lubrication</li>
              <li>Nut lubrication for tuning stability</li>
            </ul>
          </article>

          {/* Fret Level */}
          <article className="card service-card">
            <h3 style={{ marginBottom: 6 }}>
              Fret Level <small>(Setup Included)</small>
            </h3>
            <div className="price-row">
              <GeoPrice usd={250} />
            </div>
            <ul className="pick-list">
              <li>Precision fretwork for lower action</li>
              <li>Fret leveling and crowning</li>
              <li>Fret end dressing for smooth neck feel</li>
              <li>Polished frets</li>
              <li>Optional services: pressing, sprout treatment, gluing</li>
            </ul>
          </article>

          {/* Wiring & Electronics */}
          <article className="card service-card">
            <h3>Wiring &amp; Electronics</h3>
            {isPH ? (
              <>
                <div className="price-row">
                  <GeoPrice />
                </div>
                <ul className="pick-list">
                  <li>Pickup replacement – per pickup</li>
                  <li>Potentiometer change – per pot</li>
                  <li>Switch replacement</li>
                  <li>Loose wire &amp; input jack fix</li>
                  <li>Full overhaul rewire (Gavitt wires included)</li>
                  <li>Scratchy potentiometer cleaning included</li>
                </ul>
              </>
            ) : (
              <ul className="pick-list">
                <PriceLine label="Pickup replacement – per pickup" usd={40} />
                <PriceLine label="Potentiometer change – per pot" usd={35} />
                <PriceLine label="Switch replacement" usdRange={[40, 50]} />
                <PriceLine label="Loose wire &amp; input jack fix" usd={25} />
                <PriceLine label="Full overhaul rewire" usdRange={[100, 150]} />
                <li>Scratchy potentiometer cleaning included</li>
              </ul>
            )}
          </article>

          {/* Custom Nut Fabrication */}
          <article className="card service-card">
            <h3 style={{ marginBottom: 6 }}>Custom Nut Fabrication</h3>
            <div className="price-row">
              {/* @ts-ignore */}
              <GeoPrice usdRange={[60, 100]} />
            </div>
            <ul className="pick-list">
              <li>Crafted with precise spacing tools</li>
              <li>Material options: GraphTech, bone</li>
              <li>Height tailored to preference</li>
            </ul>
          </article>

          {/* Refret */}
          <article className="card service-card">
            <h3 style={{ marginBottom: 6 }}>Refret (Rosewood/Dark Fretboards)</h3>
            <div className="price-row">
              <GeoPrice usd={550} />
            </div>
            <ul className="pick-list">
              <li>Press method using arbor press</li>
              <li>Re-radius as needed</li>
              <li>Jescar Jumbo Fretwires</li>
              <li>Bound/unbound refret</li>
              <li>Fretboard leveling included if needed</li>
            </ul>
          </article>

          {/* Acoustic Preamp Installation */}
          <article className="card service-card">
            <h3>Acoustic Preamp Installation</h3>
            {isPH ? (
              <>
                <div className="price-row">
                  <GeoPrice />
                </div>
                <ul className="pick-list">
                  <li>Wood mounted preamps</li>
                  <li>Soundhole preamps</li>
                  <li>Recommended with setup service</li>
                </ul>
              </>
            ) : (
              <ul className="pick-list">
                <PriceLine label="Wood-mounted preamps" usdRange={[120, 150]} />
                <PriceLine label="Soundhole preamps" usd={100} />
                <li>Recommended with setup service</li>
              </ul>
            )}
          </article>

          {/* Crack Repair */}
          <article className="card service-card">
            <h3>Crack Repair Service</h3>
            {isPH ? (
              <>
                <div className="price-row">
                  <GeoPrice />
                </div>
                <ul className="pick-list">
                  <li>Crack / headstock crack repair</li>
                  <li>Spray paint (extra, solid colors only)</li>
                  <li>CA Glue or Titebond Wood Glue</li>
                </ul>
              </>
            ) : (
              <ul className="pick-list">
                <PriceLine
                  label="Crack / headstock crack repair"
                  usdRange={[120, 150]}
                  note={<em>+ depending on severity</em>}
                />
                <li>Spray paint (extra, solid colors only)</li>
                <li>CA Glue or Titebond Wood Glue</li>
              </ul>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
