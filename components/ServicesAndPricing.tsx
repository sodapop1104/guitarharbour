// components/ServicesAndPricing.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import GeoPrice from "./GeoPrice";

const ASSET_BASE = "/assets/services-pricing";

/** serviceKey -> folder name under /public/assets/services-pricing */
const SERVICE_FOLDERS: Record<string, string> = {
  "deep-cleaning": "Deep Cleaning",
  "basic-setup": "Basic Setup",
  "fret-level": "Fret Level",
  "wiring": "Wiring & Electronics",
  "custom-nut": "Custom Nut Fabrication",
  "refret": "Refret",
  "preamp": "Acoustic Preamp Installation",
  "crack-repair": "Crack Repair Service",
};

type Manifest = { images: string[] };

/** Read the 'country_code' cookie written by middleware and check for PH */
function useIsPH() {
  const [isPH, setIsPH] = useState<boolean | null>(null);
  useEffect(() => {
    const m = document.cookie.match(/(?:^| )country_code=([^;]+)/);
    const code = m ? decodeURIComponent(m[1]).toUpperCase() : "";
    setIsPH(code === "PH");
  }, []);
  return isPH;
}

/** Load manifest.json for a given service and return absolute src URLs */
function useServiceImages(serviceKey: string) {
  const folder = SERVICE_FOLDERS[serviceKey];
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!folder) {
        setImages([]);
        return;
      }
      const url = `${ASSET_BASE}/${encodeURI(folder)}/manifest.json`;
      try {
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = (await res.json()) as Manifest;
        const arr = Array.isArray(data.images) ? data.images : [];
        const full = arr.map((n) => `${ASSET_BASE}/${encodeURI(folder)}/${encodeURI(n)}`);
        if (!ignore) setImages(full);
      } catch {
        if (!ignore) setImages([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [folder]);

  return { loading: images === null, sources: images ?? [] };
}

/** Back face with lightweight carousel (arrows + dots) */
function CardBackMedia({ serviceKey, alt }: { serviceKey: string; alt: string }) {
  const { loading, sources } = useServiceImages(serviceKey);
  const [idx, setIdx] = useState(0);

  const hasImages = sources.length > 0;
  const src = hasImages ? sources[idx] : `${ASSET_BASE}/placeholder.jpg`;

  // keyboard left/right when card is focused
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!hasImages) return;
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + sources.length) % sources.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % sources.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasImages, sources.length]);

  return (
    <div className="flip-card-back" style={{ position: "relative" }}>
      <div
        className="back-media-wrap"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {!loading && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            style={{ objectFit: "cover" }}
            onError={() => { /* silent */ }}
            priority={serviceKey === "basic-setup"}
          />
        )}

        {sources.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + sources.length) % sources.length); }}
              style={ctrlBtnStyle("left")}
            >‹</button>

            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % sources.length); }}
              style={ctrlBtnStyle("right")}
            >›</button>

            <div style={dotsWrapStyle}>
              {sources.map((_, i) => (
                <span
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                  style={{
                    width: 7, height: 7, borderRadius: 999,
                    background: i === idx ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.45)",
                    display: "inline-block", margin: "0 4px", cursor: "pointer"
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ctrlBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: 8,
    transform: "translateY(-50%)",
    border: "1px solid var(--line)",
    background: "rgba(0,0,0,.55)",
    color: "#fff",
    width: 36, height: 36, borderRadius: 999,
    fontSize: 22, lineHeight: "34px", textAlign: "center",
    cursor: "pointer",
    zIndex: 2,
  } as React.CSSProperties;
}
const dotsWrapStyle: React.CSSProperties = {
  position: "absolute", left: 0, right: 0, bottom: 8,
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2
};

/** Front face helper */
function CardFront({
  title,
  priceUSD,
  isPH,
  children,
}: {
  title: React.ReactNode;
  priceUSD?: number;
  isPH: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flip-card-front">
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      <div className="price-row" style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
        {priceUSD !== undefined ? (
          <GeoPrice
            usd={priceUSD}
            contactText="Contact for local pricing"
            contactHref="/contact"
          />
        ) : isPH === null ? null : isPH ? (
          <>
            <p className="muted" style={{ margin: 0 }}>Contact for local pricing</p>
            <a
              href="/contact"
              className="btn-link"
              onClick={(e) => e.stopPropagation()} // don't flip when tapping link
              style={{ border: "1px solid var(--line)", padding: ".35rem .6rem", borderRadius: ".6rem" }}
            >
              Contact Us
            </a>
          </>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Flip card with tap/click toggle (mobile) + still works with :hover (desktop) */
function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article
      className={`card service-card flip-card ${flipped ? "is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      tabIndex={0}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </article>
  );
}

export default function ServicesAndPricing() {
  const isPH = useIsPH();

  return (
    <section id="services">
      <div className="container">
        {/* Preface */}
        <div className="reveal" data-anim="up" style={{ marginBottom: 18 }}>
          <h3 className="gradient-text" style={{ margin: 0 }}>The Difference Is in the Details</h3>
          <div className="fret-divider" />
          <p className="muted" style={{ margin: 0 }}>
            Your guitar deserves more than a quick fix. With premium tools and years of experience,
            every adjustment is measured, tested, and refined—so it plays and sounds at its peak.
          </p>
        </div>

        <h2 className="reveal" data-anim="up">Services &amp; Pricing</h2>

        {/* PH-only warranty banner */}
        {isPH ? (
          <div
            className="ph-warranty reveal"
            data-anim="up"
            aria-live="polite"
            style={{ border: "1px dashed var(--line)", padding: ".5rem .75rem", borderRadius: ".6rem", margin: ".5rem 0 1rem", color: "var(--muted)" }}
          >
            PH includes <strong>3 months warranty</strong>
          </div>
        ) : null}

        {/* GRID of flip-cards; structure matches your globals.css */}
        <div className="grid stagger reveal" data-anim="up">
          {/* Deep Cleaning */}
          <FlipCard
            front={
              <>
                <CardFront title="Deep Cleaning" priceUSD={35} isPH={isPH}>
                  <ul className="pick-list">
                    <li>A complete hardware refresh for your guitar.</li>
                    <li>Disassembly, cleaning, and reassembly of bridges (Floyd Rose, Strat, 2-point tremolo)</li>
                    <li>Full hardware deep clean (including tuning pegs)</li>
                    <li>Fretboard reconditioning</li>
                    <li>All cleaning done with MusicNomad professional tools and solutions</li>
                    <li>Scratchy potentiometer, cleaning included.</li>
                    <li>Available when you avail one of our setup packages.</li>
                  </ul>
                </CardFront>
              </>
            }
            back={<CardBackMedia serviceKey="deep-cleaning" alt="Deep Cleaning examples" />}
          />

          {/* Basic Setup */}
          <FlipCard
            front={
              <CardFront title="Basic Setup" priceUSD={150} isPH={isPH}>
                <ul className="pick-list">
                  <li>Designed to improve your guitar’s comfort and playability.</li>
                  <li>Fretboard cleaning &amp; conditioning (rosewoods get mineral oil treatment)</li>
                  <li>Fretwire polish for smoother bends</li>
                  <li>Nut height adjustment using MusicNomad height gauges and nut files or our trusted custom measurements</li>
                  <li>Intonation with the Turbo Tuner ST-300 (±0.02 cent accuracy—the most precise tool available)</li>
                  <li>Action adjustment (low, medium, high—tailored to client preference &amp; instrument&apos;s fret and fretboard condition)</li>
                  <li>Pickup height adjustment using MusicNomad measurement tools (customizable to client preference)</li>
                  <li>Basic body cleaning (deep cleaning with hardware disassembly is extra)</li>
                  <li>String lubrication for smoother sliding and extended string life</li>
                  <li>Nut lubrication with MusicNomad Nut Sauce for tuning stability and smoother bends</li>
                </ul>
              </CardFront>
            }
            back={<CardBackMedia serviceKey="basic-setup" alt="Basic Setup examples" />}
          />

          {/* Fret Level */}
          <FlipCard
            front={
              <CardFront
                title={<><span>Fret Level</span> <small>(Setup Included)</small></>}
                priceUSD={250}
                isPH={isPH}
              >
                <ul className="pick-list">
                  <li>Precision fretwork using specialized tools + experience. Higher chance of lower action vs. basic setup.</li>
                  <li>Fret leveling and crowning with job-specific tools</li>
                  <li>Fret end dressing for a smooth, comfortable neck feel</li>
                  <li>Polished frets for smooth, comfortable bending</li>
                  <li>Optional: fret pressing (hammer method), fret sprout treatment, fret end gluing (depends on instrument condition)</li>
                </ul>
              </CardFront>
            }
            back={<CardBackMedia serviceKey="fret-level" alt="Fret Level examples" />}
          />

          {/* Wiring & Electronics (variable pricing) */}
          <FlipCard
            front={
              <CardFront title="Wiring & Electronics" isPH={isPH}>
                {isPH ? null : (
                  <ul className="pick-list">
                    <li>Pickup replacement – $40 each</li>
                    <li>Potentiometer change – $35 each</li>
                    <li>Switch replacement – $40–$50</li>
                    <li>Loose wire &amp; input jack fix – $25</li>
                    <li>Full overhaul rewire (Gavitt wires included) – $100–$150</li>
                    <li>Scratchy potentiometer cleaning included with all wiring jobs</li>
                  </ul>
                )}
              </CardFront>
            }
            back={<CardBackMedia serviceKey="wiring" alt="Wiring & Electronics examples" />}
          />

          {/* Custom Nut Fabrication */}
          <FlipCard
            front={
              <CardFront title="Custom Nut Fabrication" isPH={isPH}>
                <div style={{ marginBottom: ".5rem" }}>
                  {isPH ? null : <strong>$60–$100 USD</strong>}
                </div>
                <ul className="pick-list">
                  <li>Crafted with precise spacing ruler tools</li>
                  <li>Material options: GraphTech, bone, slotted or blank</li>
                  <li>Height tailored to your playing style and preference (or our custom height measurement)</li>
                </ul>
              </CardFront>
            }
            back={<CardBackMedia serviceKey="custom-nut" alt="Custom nut examples" />}
          />

          {/* Refret */}
          <FlipCard
            front={
              <CardFront title="Refret (Rosewood/Dark Fretboards)" priceUSD={550} isPH={isPH}>
                <ul className="pick-list">
                  <li>Fret press method using an arbor press</li>
                  <li>Re-radius depends on current fretboard condition</li>
                  <li>Jescar Jumbo fretwires</li>
                  <li>Bound/unbound refret</li>
                  <li>Fretboard leveling included if needed</li>
                </ul>
              </CardFront>
            }
            back={<CardBackMedia serviceKey="refret" alt="Refret examples" />}
          />

          {/* Acoustic Preamp Installation */}
          <FlipCard
            front={
              <CardFront title="Acoustic Preamp Installation" isPH={isPH}>
                {isPH ? null : (
                  <ul className="pick-list">
                    <li>Wood-mounted (Fishman Presys/Isys, Cherub GT series) – $120–$150</li>
                    <li>Soundhole (Fishman Sonitone and similar) – $100</li>
                    <li>Recommended: pair with Basic or Full Setup</li>
                  </ul>
                )}
              </CardFront>
            }
            back={<CardBackMedia serviceKey="preamp" alt="Acoustic preamp examples" />}
          />

          {/* Crack Repair */}
          <FlipCard
            front={
              <CardFront title="Crack Repair Service" isPH={isPH}>
                {isPH ? null : (
                  <ul className="pick-list">
                    <li>$120–$150+ (depending on the crack/headstock crack)</li>
                    <li>Spray paint available (solid colors) for an additional cost</li>
                    <li>Adhesives: CA Glue (Highly Recommended) or Titebond wood glue</li>
                  </ul>
                )}
              </CardFront>
            }
            back={<CardBackMedia serviceKey="crack-repair" alt="Crack repair examples" />}
          />
        </div>
      </div>
    </section>
  );
}