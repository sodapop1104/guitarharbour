"use client";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="nav container-fluid">
        <div className="nav-left">
          <ThemeToggle />
        </div>

        <div className="logo" aria-label="Guitar Harbour">
          {/* Dark default */}
          <img className="logo-dark" src="/assets/logo.svg" alt="" aria-hidden="true" />
          {/* Light variant */}
          <img className="logo-light" src="/assets/logo1.svg" alt="" aria-hidden="true" />
          <strong>Guitar Harbour</strong>
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
            <li><a href="#repairs">Repairs</a></li>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}