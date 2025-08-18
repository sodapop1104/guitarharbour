import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "../../../lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);
  // Paste tokens.refresh_token into GOOGLE_REFRESH_TOKEN in .env.local
  return NextResponse.json(tokens);
}