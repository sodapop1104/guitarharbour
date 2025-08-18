"use client";
import { useRef, useState, useEffect } from "react";

export default function Shop() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const EPS = 2;
    const { scrollLeft, clientWidth, scrollWidth } = t;
    if (scrollWidth <= clientWidth + EPS) { setCanScrollLeft(false); setCanScrollRight(false); return; }
    setCanScrollLeft(scrollLeft > EPS);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - EPS);
  };

  const slide = (dir = 1) => {
    const t = trackRef.current; if (!t) return;
    const first = t.querySelector<HTMLElement>(".slide"); if (!first) return;
    const step = first.getBoundingClientRect().width + 16;
    t.scrollBy({ left: dir * step, behavior: "smooth" });
    setTimeout(checkScroll, 260);
  };

  useEffect(() => {
    const t = trackRef.current; if (!t) return;
    requestAnimationFrame(checkScroll);
    t.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(t);
    return () => { t.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); ro.disconnect(); };
  }, []);

  return (
    <section id="shop">
      <div className="container">
        <h2 className="reveal" data-anim="up">Shop</h2>
        <p className="muted reveal" data-anim="up">
          Curated new &amp; used gear. <strong>Online shop coming soon.</strong>
        </p>

        <div className="slider reveal" data-anim="up" role="region" aria-label="Featured items">
          {canScrollLeft && (
            <button className="prev" aria-label="Previous" onClick={() => slide(-1)}>
              &#10094;
            </button>
          )}

          <div
            className="track"
            ref={trackRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" && canScrollRight) slide(1);
              if (e.key === "ArrowLeft" && canScrollLeft) slide(-1);
            }}
          >
            <article className="slide"><h3>Strat-Style Build</h3><p>Modern C neck, alnico V pickups.</p></article>
            <article className="slide"><h3>Jazzmaster Refined</h3><p>P-90 set, upgraded wiring.</p></article>
            <article className="slide"><h3>Clean Boost Pedal</h3><p>Transparent gain, true bypass.</p></article>
            <article className="slide"><h3>Tele Twang Machine</h3><p>Brass saddles, tight setup.</p></article>
          </div>

          {canScrollRight && (
            <button className="next" aria-label="Next" onClick={() => slide(1)}>
              &#10095;
            </button>
          )}
        </div>
      </div>
    </section>
  );
}