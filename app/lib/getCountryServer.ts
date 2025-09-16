// app/lib/getCountryServer.ts
import { cookies, headers } from "next/headers";

/**
 * Returns an uppercased ISO country code, e.g. "US", "PH", or "" if unknown.
 * Next 14.2+/15: cookies() and headers() are async.
 */
export async function getCountryServer(): Promise<string> {
  // Prefer cookie set by middleware
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("country_code")?.value;
  if (fromCookie) return fromCookie.toUpperCase();

  // Fallback: platform headers (Vercel/Cloudflare)
  const h = await headers();
  const hdr =
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    "";

  return (hdr || "").toUpperCase();
}
