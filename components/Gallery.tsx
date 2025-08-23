"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Img = { src: string; w: number; h: number; alt: string };

const IMAGES: Img[] = [
  { src: "/assets/gallery/1.jpg",  w: 1200, h: 800, alt: "1" },
  { src: "/assets/gallery/2.jpg",  w: 1200, h: 800, alt: "2" },
  { src: "/assets/gallery/3.jpg",  w: 1200, h: 800, alt: "3" },
  { src: "/assets/gallery/4.jpg",  w: 1200, h: 800, alt: "4" },
  { src: "/assets/gallery/5.jpg",  w: 1200, h: 800, alt: "5" },
  { src: "/assets/gallery/6.jpg",  w: 1200, h: 800, alt: "6" },
  { src: "/assets/gallery/7.jpg",  w: 1200, h: 800, alt: "7" },
  { src: "/assets/gallery/8.jpg",  w: 1200, h: 800, alt: "8" },   // <- removed trailing space
  { src: "/assets/gallery/9.jpg",  w: 1200, h: 800, alt: "9" },
  { src: "/assets/gallery/10.jpg", w: 1200, h: 800, alt: "10" },
  { src: "/assets/gallery/11.jpg", w: 1200, h: 800, alt: "11" },
  { src: "/assets/gallery/12.jpg", w: 1200, h: 800, alt: "12" },
];

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const openAt = (i: number) => { setIdx(i); setOpen(true); };
  const next = useCallback(() => setIdx((i) => (i + 1) % IMAGES.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length), []);

  // keyboard nav when lightbox is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  return (
    <section className="gh-gallery">
      <h2 className="gh-gallery-title">Gallery</h2>

      <div className="gh-gallery-grid">
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            className="gh-thumb"
            onClick={() => openAt(i)}
            aria-label={`Open image ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.h}
              className="gh-thumb-img"
              // Help the browser choose the right size
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              // Prioritize first few thumbs for snappier UX
              priority={i < 3}
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="gh-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <div className="gh-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="gh-lightbox-close" onClick={close} aria-label="Close">✕</button>
            <button className="gh-lightbox-prev" onClick={prev} aria-label="Previous">‹</button>
            <img
              src={IMAGES[idx].src}
              alt={IMAGES[idx].alt}
              className="gh-lightbox-img"
              loading="eager"
            />
            <button className="gh-lightbox-next" onClick={next} aria-label="Next">›</button>
            <div className="gh-lightbox-caption">{IMAGES[idx].alt}</div>
          </div>
        </div>
      )}
    </section>
  );
}