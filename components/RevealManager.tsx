// components/RevealManager.tsx
"use client";
import { useEffect } from "react";

export default function RevealManager() {
  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    document.body.classList.add("anim");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .stagger"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            target.classList.add("in");
            io.unobserve(target);
          }
        }
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}