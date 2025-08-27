"use client";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav container-fluid">
        <div className="nav-left">
          <ThemeToggle />
        </div>

        {/* Logo row: icon left, text block right */}
        <div className="logo" aria-label="Guitar Harbour">
          {/* Theme-switched icons */}
          <img
            className="logo-dark"
            src="/assets/logo.svg"
            alt="Guitar Harbour logo"
          />
          <img
            className="logo-light"
            src="/assets/logo1.svg"
            alt="Guitar Harbour logo"
          />

          {/* Wordmark + subtitle stacked */}
          <div className="logo-text">
            <span className="logo-word">Guitar Harbour</span>
            <span className="logo-sub">
              Philippines&nbsp;| Los&nbsp;Angeles, CA
            </span>
          </div>
        </div>

        {/* Navigation */}
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
            <li><a href="#shop">Shop</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}