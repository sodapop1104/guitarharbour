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

        {/* Center logo + wordmark */}
        <div className="logo" aria-label="Guitar Harbour">
          <img className="logo-dark" src="/assets/logo.svg" alt="" aria-hidden="true" />
          <img className="logo-light" src="/assets/logo1.svg" alt="" aria-hidden="true" />
          <span className="logo-word">Guitar Harbour</span>
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
            <li><a href="#shop">Shop</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>    
          </ul>
        </nav>
      </div>
    </header>
  );
}