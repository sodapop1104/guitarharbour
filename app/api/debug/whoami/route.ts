// app/api/debug/whoami/route.ts
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getOAuth2Client } from "../../../lib/google";

export async function GET() {
  try {
    const auth = getOAuth2Client();
    const me = await google.oauth2({ version: "v2", auth }).userinfo.get();
    return NextResponse.json({ authenticatedAs: me.data.email || null });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}