// components/GeoPrice.tsx
"use client";

import React, { useEffect, useState } from "react";

type Props = {
  /** Single USD price (e.g., 150) */
  usd?: number;
  /** USD range (e.g., [100, 150]) */
  usdRange?: [number, number];
  /** Optional suffix like "USD" (defaults to "USD") */
  suffix?: string;

  /** PH side (or no price): show this note */
  contactText?: string;

  className?: string;
};

function useCountryCode() {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    const m = document.cookie.match(/(?:^| )country_code=([^;]+)/);
    setCode(m ? decodeURIComponent(m[1]).toUpperCase() : "");
  }, []);
  return code;
}

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function GeoPrice({
  usd,
  usdRange,
  suffix = "USD",
  contactText = "Contact us for pricing",
  className,
}: Props) {
  const country = useCountryCode();
  if (country === null) return null;

  const isPH = country === "PH";
  const hasSingle = typeof usd === "number" && !Number.isNaN(usd);
  const hasRange =
    Array.isArray(usdRange) &&
    usdRange.length === 2 &&
    typeof usdRange[0] === "number" &&
    typeof usdRange[1] === "number";

  // PH path: single muted line under title
  if (isPH) {
    return (
      <div
        className={className}
        style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "0.5rem" }}
      >
        {contactText}
      </div>
    );
  }

  // US/others with prices
  if (hasSingle) {
    return (
      <div
        className={className}
        style={{ color: "var(--muted)", fontWeight: 600, marginBottom: "0.5rem" }}
      >
        {"\u00A0"}
        {formatUSD(usd!)} {suffix}
      </div>
    );
  }

  if (hasRange) {
    return (
      <div
        className={className}
        style={{ color: "var(--muted)", fontWeight: 600, marginBottom: "0.5rem" }}
      >
        {"\u00A0"}
        {formatUSD(usdRange![0])}–{formatUSD(usdRange![1])} {suffix}
      </div>
    );
  }

  // Fallback if no price passed (non-PH)
  return (
    <div
      className={className}
      style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "0.5rem" }}
    >
      {contactText}
    </div>
  );
}
