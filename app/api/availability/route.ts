// app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import { DateTime, Interval } from "luxon";
import type { calendar_v3 } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLOT_MIN = 60; // change to 30 for 30-min slots

function withinOfficeHours(dtUTC: import("luxon").DateTime) {
  const LA_TZ = process.env.LA_TZ || "America/Los_Angeles";
  const PH_TZ = process.env.PH_TZ || "Asia/Manila";
  const START = Number(process.env.WORK_START_HOUR || 9);
  const END = Number(process.env.WORK_END_HOUR || 18);
  const endStart = END - SLOT_MIN / 60;

  const la = dtUTC.setZone(LA_TZ);
  const ph = dtUTC.setZone(PH_TZ);
  const laOK = la.hour + la.minute / 60 >= START && la.hour + la.minute / 60 <= endStart;
  const phOK = ph.hour + ph.minute / 60 >= START && ph.hour + ph.minute / 60 <= endStart;

  return laOK || phOK;
}

function isTimePeriod(
  tp: calendar_v3.Schema$TimePeriod | undefined
): tp is calendar_v3.Schema$TimePeriod {
  return !!tp && !!tp.start && !!tp.end;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const viewerTz = url.searchParams.get("viewerTz") || "America/Los_Angeles";
  const date = url.searchParams.get("date"); // YYYY-MM-DD

  const day = DateTime.fromISO(date ?? DateTime.now().toISODate(), { zone: viewerTz });
  const windowStart = day.startOf("day").toUTC();
  const windowEnd = day.endOf("day").toUTC();

  const cal = calendarClient();
  const { data } = await cal.freebusy.query({
    requestBody: {
      timeMin: windowStart.toISO(),
      timeMax: windowEnd.toISO(),
      timeZone: "UTC",
      items: [
        { id: process.env.MAIN_CALENDAR_ID! },
        { id: process.env.HOLDS_CALENDAR_ID! },
      ],
    },
  });

  const calendars: Record<string, calendar_v3.Schema$FreeBusyCalendar> =
    (data.calendars as Record<string, calendar_v3.Schema$FreeBusyCalendar>) ?? {};

  const timePeriods: calendar_v3.Schema$TimePeriod[] = Object.values(calendars)
    .flatMap((c) => c.busy ?? [])
    .filter(isTimePeriod);

  const busyIntervals: Interval[] = timePeriods.map((b) =>
    Interval.fromDateTimes(
      DateTime.fromISO(b.start!, { zone: "utc" }),
      DateTime.fromISO(b.end!, { zone: "utc" })
    )
  );

  const slots: string[] = [];
  let cursor = windowStart;
  while (cursor.plus({ minutes: SLOT_MIN }) <= windowEnd) {
    if (withinOfficeHours(cursor)) {
      const slot = Interval.fromDateTimes(cursor, cursor.plus({ minutes: SLOT_MIN }));
      const overlaps = busyIntervals.some((b) => b.overlaps(slot));
      if (!overlaps) slots.push(cursor.toISO());
    }
    cursor = cursor.plus({ minutes: SLOT_MIN });
  }

  return NextResponse.json({ date: day.toISODate(), viewerTz, slotMinutes: SLOT_MIN, slots });
}