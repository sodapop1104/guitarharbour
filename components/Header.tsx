"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

type AssetsResponse = {
  dark: { id: string; name: string; url: string } | null;
  light: { id: string; name: string; url: string } | null;
  favicon: { id: string; name: string; url: string; full: string } | null;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [darkUrl, setDarkUrl] = useState<string>("");
  const [lightUrl, setLightUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/assets", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load assets");
        const data: AssetsResponse = await res.json();
        if (!mounted) return;
        setDarkUrl(data.dark?.url || "");
        setLightUrl(data.light?.url || "");
      } catch {
        if (mounted) {
          setDarkUrl("/assets/logo.svg");
          setLightUrl("/assets/logo1.svg");
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="site-header">
      <div className="nav container-fluid">
        <div className="nav-left">
          <ThemeToggle />
        </div>

        <div className="logo" aria-label="Guitar Harbour">
          {darkUrl ? (
            <Image
              className="logo-dark"
              src={darkUrl}
              alt="Guitar Harbour logo (dark)"
              width={160}
              height={40}
              priority
              sizes="(max-width: 640px) 120px, 160px"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          ) : (
            <img className="logo-dark" src="/assets/logo.svg" alt="Guitar Harbour logo (dark)" />
          )}

          {lightUrl ? (
            <Image
              className="logo-light"
              src={lightUrl}
              alt="Guitar Harbour logo (light)"
              width={160}
              height={40}
              priority
              sizes="(max-width: 640px) 120px, 160px"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          ) : (
            <img className="logo-light" src="/assets/logo1.svg" alt="Guitar Harbour logo (light)" />
          )}

          <div className="logo-text">
            <span className="logo-word">Guitar Harbour</span>
            <span className="logo-sub">Philippines&nbsp;| Los&nbsp;Angeles, CA</span>
          </div>
        </div>

        <nav aria-label="Primary">
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
            type="button"
          >
            Menu
          </button>
          <ul id="menu" className={open ? "open" : ""}>
            <li><a href="#services">Services</a></li>
            <li><a href="#book">Online Consultation</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
