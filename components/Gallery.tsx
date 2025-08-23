"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Img = { src: string; alt: string };
const MAX_VISIBLE = 12;

// Parse hash formats:
//  - #gallery=10            (index)
//  - #gallery=filename.jpg  (by filename)
//  - #gallery=filename      (without extension)
function parseGalleryHash(hash: string) {
  const m = hash.match(/#gallery=(.+)$/i);
  if (!m) return null;
  const value = decodeURIComponent(m[1]);
  // index?
  const asNum = Number(value);
  if (!Number.isNaN(asNum)) return { type: "index" as const, value: asNum };
  // filename?
  return { type: "name" as const, value };
}

function filenameFromSrc(src: string) {
  const base = src.split("/").pop() || "";
  return base;
}

function nameWithoutExt(srcOrName: string) {
  return (srcOrName.split("/").pop() || "").replace(/\.[^.]+$/, "");
}

export default function Gallery() {
  const [all, setAll] = useState<Img[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // For swipe gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartT = useRef<number | null>(null);

  // Load images from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        const data = (await res.json()) as { images: string[] };
        if (!cancelled) {
          const imgs = (data.images ?? []).map((src) => ({
            src,
            alt: nameWithoutExt(src) || "image",
          }));
          setAll(imgs);
        }
      } catch {
        if (!cancelled) setAll([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Visible subset
  const visible = useMemo(() => (showAll ? all : all.slice(0, MAX_VISIBLE)), [all, showAll]);

  const close = useCallback(() => {
    setOpen(false);
    // Clear hash on close
    if (typeof window !== "undefined") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const pushHashForIndex = useCallback(
    (i: number) => {
      if (typeof window === "undefined") return;
      const name = filenameFromSrc(all[i].src);
      const newHash = `#gallery=${encodeURIComponent(name)}`;
      if (window.location.hash !== newHash) {
        history.replaceState(null, "", window.location.pathname + window.location.search + newHash);
      }
    },
    [all]
  );

  const openAt = useCallback(
    (i: number) => {
      setIdx(i);
      setOpen(true);
      pushHashForIndex(i);
    },
    [pushHashForIndex]
  );

  const next = useCallback(() => {
    setIdx((i) => {
      const ni = all.length ? (i + 1) % all.length : i;
      if (all.length) pushHashForIndex(ni);
      return ni;
    });
  }, [all.length, pushHashForIndex]);

  const prev = useCallback(() => {
    setIdx((i) => {
      const ni = all.length ? (i - 1 + all.length) % all.length : i;
      if (all.length) pushHashForIndex(ni);
      return ni;
    });
  }, [all.length, pushHashForIndex]);

  // Keyboard nav when lightbox is open
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

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  // Open lightbox from hash on first load / when images arrive
  useEffect(() => {
    if (!all.length) return;
    const openFromHash = () => {
      const p = parseGalleryHash(window.location.hash);
      if (!p) return;

      let targetIndex = 0;
      if (p.type === "index") {
        // clamp to bounds
        targetIndex = Math.max(0, Math.min(all.length - 1, Number(p.value)));
      } else {
        // by name
        const value = String(p.value).toLowerCase();
        // support both filename with extension and without
        const byFull = all.findIndex((img) => filenameFromSrc(img.src).toLowerCase() === value);
        const byBase =
          byFull === -1 ? all.findIndex((img) => nameWithoutExt(img.src).toLowerCase() === value) : byFull;
        targetIndex = byBase !== -1 ? byBase : 0;
      }
      setShowAll(true); // reveal full gallery if coming from deep link
      openAt(targetIndex);
    };

    // on initial images load
    openFromHash();

    // also react to future hash changes while on the page
    const onHash = () => {
      if (!window.location.hash.startsWith("#gallery=")) return;
      openFromHash();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [all, openAt]);

  // Swipe gestures (inside lightbox)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartT.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null || touchStartT.current == null)
      return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const dt = Date.now() - touchStartT.current;

    // Basic swipe heuristic
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const isHorizontal = absX > 50 && absX > absY * 1.5 && dt < 600;

    if (isHorizontal) {
      if (dx < 0) next();
      else prev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchStartT.current = null;
  };

  return (
    <section className="gh-gallery">
      <h2 className="gh-gallery-title">Gallery</h2>

      <div className="gh-gallery-grid">
        {visible.map((img, i) => (
          <button
            key={img.src}
            className="gh-thumb"
            onClick={() => openAt(i)} // index aligns since visible is slice from 0
            aria-label={`Open image ${img.alt}`}
          >
            <div className="gh-thumb-wrap">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="gh-thumb-img"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3}
              />
            </div>
          </button>
        ))}
      </div>

      {/* View full gallery / Show less */}
      {all.length > MAX_VISIBLE && !showAll && (
        <div className="gh-gallery-actions">
          <button className="gh-btn" onClick={() => setShowAll(true)}>
            View full gallery ({all.length})
          </button>
        </div>
      )}
      {showAll && all.length > MAX_VISIBLE && (
        <div className="gh-gallery-actions">
          <button className="gh-btn gh-btn-secondary" onClick={() => setShowAll(false)}>
            Show less
          </button>
        </div>
      )}

      {/* Lightbox */}
      {open && all.length > 0 && (
        <div className="gh-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <div className="gh-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="gh-lightbox-close" onClick={close} aria-label="Close">
              ✕
            </button>

            <div
              className="gh-lightbox-img-wrap"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={all[idx].src}
                alt={all[idx].alt}
                fill
                priority
                sizes="92vw"
                className="gh-lightbox-img"
              />
              <button className="gh-lightbox-prev" onClick={prev} aria-label="Previous">
                ‹
              </button>
              <button className="gh-lightbox-next" onClick={next} aria-label="Next">
                ›
              </button>
            </div>

            <div className="gh-lightbox-caption">{all[idx].alt}</div>
          </div>
        </div>
      )}
    </section>
  );
}