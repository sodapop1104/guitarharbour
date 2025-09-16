// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "country_code";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function middleware(req: NextRequest) {
  // Some deployments still populate req.geo at runtime on Vercel.
  // TS types may not include it, so we cast to any *safely*.
  const geoCountry =
    ((req as any).geo?.country as string | undefined) ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";

  const existing = req.cookies.get(COOKIE)?.value;
  if (existing) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  res.cookies.set({
    name: COOKIE,
    value: (geoCountry || "").toUpperCase(),
    maxAge: MAX_AGE,
    path: "/",
    httpOnly: false, // allow client JS to read it
    sameSite: "lax",
  });

  // Make caches aware we vary by cookie (merge with existing Vary if present)
  const priorVary = res.headers.get("Vary");
  res.headers.set("Vary", priorVary ? `${priorVary}, Cookie` : "Cookie");

  return res;
}

export const config = {
  matcher: ["/(.*)"],
};
