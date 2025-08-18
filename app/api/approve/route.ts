import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import crypto from "crypto";
import type { calendar_v3 } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEETING_MIN = 30; // ← booking length

function verify(token: string) {
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", process.env.APP_SECRET!).update(data).digest("base64url");
  if (sig !== expected) throw new Error("Bad token");
  return JSON.parse(Buffer.from(data, "base64url").toString());
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { holdEventId, startISO, name, email } = verify(token);

  const tz = "UTC";
  const start = new Date(startISO);
  const end = new Date(start.getTime() + MEETING_MIN * 60 * 1000);
  const cal = calendarClient();

  // final conflict check
  const fb = await cal.freebusy.query({
    requestBody: {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      timeZone: tz,
      items: [{ id: process.env.MAIN_CALENDAR_ID! }],
    },
  });

  const calendars: Record<string, calendar_v3.Schema$FreeBusyCalendar> =
    (fb.data.calendars as Record<string, calendar_v3.Schema$FreeBusyCalendar>) ?? {};
  const conflict = Object.values(calendars).some((c) => (c.busy ?? []).length > 0);
  if (conflict) {
    return NextResponse.json({ ok: false, message: "Conflict detected. Approve failed." }, { status: 409 });
  }

  // create confirmed event on main calendar
  await cal.events.insert({
    calendarId: process.env.MAIN_CALENDAR_ID!,
    requestBody: {
      summary: `Consultation — ${name}`,
      start: { dateTime: start.toISOString(), timeZone: tz },
      end: { dateTime: end.toISOString(), timeZone: tz },
      attendees: [{ email }],
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      visibility: "private",
    },
    sendUpdates: "all",
  });

  // delete the hold
  await cal.events.delete({ calendarId: process.env.HOLDS_CALENDAR_ID!, eventId: holdEventId });

  return NextResponse.redirect(`${process.env.SITE_URL}/approved`);
}