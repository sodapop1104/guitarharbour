import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verify(token: string) {
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", process.env.APP_SECRET!).update(data).digest("base64url");
  if (sig !== expected) throw new Error("Bad token");
  return JSON.parse(Buffer.from(data, "base64url").toString());
}

async function sendMail(to: string, subject: string, html: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;
  const t = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await t.sendMail({ from: SMTP_USER, to, subject, html });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { holdEventId, email, startISO, name } = verify(token);

  const cal = calendarClient();
  await cal.events.delete({ calendarId: process.env.HOLDS_CALENDAR_ID!, eventId: holdEventId });

  await sendMail(
    email,
    "GuitarHarbour — Request declined",
    `<p>Hi ${name}, unfortunately ${new Date(startISO).toLocaleString()} won't work. Please pick another time.</p>`
  );

  return NextResponse.redirect(`${process.env.SITE_URL}/declined`);
}