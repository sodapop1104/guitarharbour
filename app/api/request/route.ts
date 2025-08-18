import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  startISO: z.string().datetime(),
  name: z.string().min(1),
  email: z.string().email(),
  notes: z.string().optional(),
});

function sign(payload: object) {
  const secret = process.env.APP_SECRET!;
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

async function sendMail(to: string, subject: string, html: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP not configured; skipping email send.");
    return;
  }
  const t = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await t.sendMail({ from: SMTP_USER, to, subject, html });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { startISO, name, email, notes } = schema.parse(body);

  const tz = "UTC";
  const start = new Date(startISO);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const cal = calendarClient();

  // Re-check availability at request time
  const fb = await cal.freebusy.query({
    requestBody: {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      timeZone: tz,
      items: [
        { id: process.env.MAIN_CALENDAR_ID! },
        { id: process.env.HOLDS_CALENDAR_ID! },
      ],
    },
  });
  const isBusy = Object.values(fb.data.calendars ?? {}).some((c: any) => (c.busy ?? []).length > 0);
  if (isBusy) {
    return NextResponse.json({ ok: false, message: "That time was just taken. Please pick another slot." }, { status: 409 });
  }

  // Create a private hold event (no attendees)
  const hold = await cal.events.insert({
    calendarId: process.env.HOLDS_CALENDAR_ID!,
    requestBody: {
      summary: `HOLD: ${name}`,
      description: [`Requester: ${name} <${email}>`, notes ? `Notes: ${notes}` : ""].filter(Boolean).join("\n"),
      start: { dateTime: start.toISOString(), timeZone: tz },
      end: { dateTime: end.toISOString(), timeZone: tz },
      visibility: "private",
      transparency: "opaque", // blocks time
      extendedProperties: { private: { requesterEmail: email } },
    },
  });

  const token = sign({ holdEventId: hold.data.id, startISO, name, email });
  const approveUrl = `${process.env.SITE_URL}/api/approve?token=${token}`;
  const declineUrl = `${process.env.SITE_URL}/api/decline?token=${token}`;

  await sendMail(
    process.env.APPROVER_EMAIL!,
    "New booking request — GuitarHarbour",
    `<p><b>${name}</b> requested <b>${new Date(startISO).toLocaleString()}</b>.</p>
     <p><a href="${approveUrl}">Approve</a> • <a href="${declineUrl}">Decline</a></p>
     <p>${notes || ""}</p>`
  );

  // In dev, also return the links (handy if SMTP not set yet)
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true, approveUrl, declineUrl });
  }

  return NextResponse.json({ ok: true });
}