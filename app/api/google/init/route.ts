// app/api/google/init/route.ts
import { NextResponse } from "next/server";
import { getOAuth2Client } from "../../../lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const oauth2 = getOAuth2Client();

  // Include ALL scopes you want covered by the refresh token.
  // Keep drive.readonly so the gallery can list files.
  const scopes = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    // add other scopes you actually use with this SAME token, if any
  ];

  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  return NextResponse.redirect(url);
}
