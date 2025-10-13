"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Img = { src: string; full: string; alt: string };
type ApiImage =
  | string
  | {
      id?: string;       // Drive file ID
      url?: string;      // Direct/public URL if you already have it
      name?: string;     // Human file name from Drive
      mimeType?: string; // Optional
    };

const MAX_VISIBLE = 12;

/* ---------------- Helpers for Drive ---------------- */

const DRIVE_ID_RE = /^[A-Za-z0-9_-]{20,}$/;

function isDriveId(s: string) {
  return DRIVE_ID_RE.test(s) && !s.includes("/") && !s.includes(".");
}

function driveThumbURL(id: string, width = 1200) {
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
}
function driveFullURL(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

function lastSegment(path: string) {
  return (path.split("/").pop() || path).trim();
}

function driveIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("id");
    if (id && isDriveId(id)) return id;
    const m = u.pathname.match(/\/d\/([A-Za-z0-9_-]{20,})/);
    if (m?.[1] && isDriveId(m[1])) return m[1];
  } catch {}
  return null;
}

function stripExt(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

const cleanName = (s: string) => stripExt(s).replace(/[-_]+/g, " ");

function normalizeToImg(item: ApiImage): Img {
  if (typeof item === "string") {
    if (isDriveId(item)) {
      return { src: driveThumbURL(item, 1200), full: driveFullURL(item), alt: "Photo" };
    }
    const id = driveIdFromUrl(item);
    if (id) {
      return { src: driveThumbURL(id, 1200), full: driveFullURL(id), alt: "Photo" };
    }
    return { src: item, full: item, alt: cleanName(lastSegment(item)) };
  }

  const { id, url, name } = item;
  if (id && isDriveId(id)) {
    return { src: driveThumbURL(id, 1200), full: driveFullURL(id), alt: name ? cleanName(name) : "Photo" };
    }
  if (url) {
    const gotId = driveIdFromUrl(url);
    if (gotId) {
      return { src: driveThumbURL(gotId, 1200), full: driveFullURL(gotId), alt: name ? cleanName(name) : "Photo" };
    }
    return { src: url, full: url, alt: name ? cleanName(name) : cleanName(lastSegment(url)) };
  }
  return { src: "", full: "", alt: name ? cleanName(name) : "Photo" };
}

function parseGalleryHash(hash: string, hashKey: string) {
  const m = hash.match(new RegExp(`#${hashKey}=(.+)$`, "i"));
  if (!m) return null;
  const value = decodeURIComponent(m[1]);
  const asNum = Number(value);
  if (!Number.isNaN(asNum)) return { type: "index" as const, value: asNum };
  return { type: "name" as const, value };
}

/** Prefer a stable Drive file ID for hash keys; fall back to filename. */
const nameKey = (img: Img) => {
  const id = driveIdFromUrl(img.full) || driveIdFromUrl(img.src);
  if (id) return id.toLowerCase();
  return stripExt(lastSegment(img.full || img.src)).toLowerCase();
};

type GalleryProps = {
  /** API endpoint to fetch images from; should include a kind, e.g. /api/gallery/finished */
  endpoint?: string;
  hashKey?: string;
  title?: string;
};

export default function Gallery({
  endpoint = "/api/gallery/finished",
  hashKey = "gallery",
  title = "", // hide "GALLERY" by default
}: GalleryProps) {
  const [all, setAll] = useState<Img[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const visible = useMemo(
    () => (showAll ? all : all.slice(0, MAX_VISIBLE)),
    [all, showAll]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const images = (json.images ?? []) as ApiImage[];
        const normalized = images.map(normalizeToImg).filter((x) => x.src);
        if (!cancelled) setAll(normalized);
      } catch {
        if (!cancelled) setAll([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  useEffect(() => {
    if (!all.length) return;
    const openFromHash = () => {
      const p = parseGalleryHash(window.location.hash, hashKey);
      if (!p) return;
      if (p.type === "index") {
        const n = Math.max(0, Math.min(all.length - 1, p.value));
        openAt(n);
        return;
      }
      const byName = all.findIndex((img) => nameKey(img) === p.value.toLowerCase());
      if (byName >= 0) openAt(byName);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [all, hashKey]);

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % all.length), [all.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + all.length) % all.length), [all.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  const gridRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const tiles = Array.from(el.querySelectorAll<HTMLElement>(".gh-tile.reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            (en.target as HTMLElement).classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    tiles.forEach((tile) => io.observe(tile));
    return () => io.disconnect();
  }, [visible.length]);

  const onThumbClick = (i: number) => {
    if (!all[i]) return;
    const key = nameKey(all[i]) || String(i);
    const newHash = `#${hashKey}=${encodeURIComponent(key)}`;
    if (window.location.hash !== newHash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search + newHash
      );
    }
    openAt(i);
  };

  return (
    <section className="gh-gallery" id={hashKey}>
      {title ? <h2 className="gh-gallery-title">{title}</h2> : null}

      <div ref={gridRef} className="gh-gallery-grid">
        {visible.map((img, i) => (
          <button
            key={(img.src || img.full) + i}
            className="gh-thumb gh-tile reveal"
            onClick={() => onThumbClick(i)}
            aria-label={`Open image ${img.alt || `#${i + 1}`}`}
          >
            <span className="gh-thumb-wrap">
              <Image
                src={img.src}
                alt={img.alt || ""}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="gh-thumb-img"
              />
            </span>
            {/* caption intentionally hidden */}
          </button>
        ))}
      </div>

      {!showAll && all.length > MAX_VISIBLE && (
        <div className="gh-gallery-controls">
          <button className="btn" onClick={() => setShowAll(true)}>
            Load More
          </button>
        </div>
      )}

      {open && all[idx] && (
        <div className="gh-lightbox" role="dialog" aria-modal="true">
          <div className="gh-lightbox-inner">
            <button className="gh-lightbox-close" onClick={close} aria-label="Close">
              ×
            </button>
            <button className="gh-lightbox-prev" onClick={prev} aria-label="Previous">
              ‹
            </button>

            <div className="gh-lightbox-img-wrap">
              <Image
                src={all[idx].full || all[idx].src}
                alt={all[idx].alt || ""}
                fill
                sizes="100vw"
                className="gh-lightbox-img"
                priority
              />
            </div>

            <button className="gh-lightbox-next" onClick={next} aria-label="Next">
              ›
            </button>
          </div>

          <div className="gh-lightbox-caption">{all[idx].alt}</div>
        </div>
      )}
    </section>
  );
}
