// components/GeoPrice.tsx
"use client";

import React, { useEffect, useState } from "react";

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

type GeoPriceProps = {
  usd: string | number;
  contactText?: string;
  contactHref?: string;
  loadingFallback?: React.ReactNode;
};

function GeoPrice({
  usd,
  contactText = "Contact for more info about pricing",
  contactHref = "/contact",
  loadingFallback = null,
}: GeoPriceProps) {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const c = readCookie("country_code");
    setCountry((c || "").toUpperCase());
  }, []);

  if (country === null) {
    return <>{loadingFallback}</>;
  }

  if (country === "PH") {
    return (
      <div className="geo-price geo-price--ph">
        <p>{contactText}</p>
        <a className="btn" href={contactHref}>
          Contact Us
        </a>
      </div>
    );
  }

  return (
    <div className="geo-price geo-price--usd">
      <p className="price">
        Price: {typeof usd === "number" ? `$${usd.toFixed(2)}` : String(usd)} USD
      </p>
    </div>
  );
}

export default GeoPrice; // ✅ default export (must match `import GeoPrice from "./GeoPrice"`)
