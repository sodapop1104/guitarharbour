import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import { DateTime, Interval } from "luxon";
import type { calendar_v3 } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLOT_MIN = 30; // 30-minute slots

// Office hours defaults (9–18). You can still override with env vars if needed.
const START = Number(process.env.WORK_START_HOUR || 9);
const END = Number(process.env.WORK_END_HOUR || 18);

const LA_TZ = process.env.LA_TZ || "America/Los_Angeles";
const PH_TZ = process.env.PH_TZ || "Asia/Manila";

// Check office hours in the VIEWER'S timezone
function withinOfficeHours(dtUTC: import("luxon").DateTime, viewerTz: string) {
  const local = dtUTC.setZone(viewerTz);
  const hourFloat = local.hour + local.minute / 60;
  const latestStart = END - SLOT_MIN / 60; // ensure the slot fits entirely before END
  return hourFloat >= START && hourFloat <= latestStart;
}

function isTimePeriod(
  tp: calendar_v3.Schema$TimePeriod | undefined
): tp is calendar_v3.Schema$TimePeriod {
  return !!tp && !!tp.start && !!tp.end;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Viewer timezone (falls back to LA if unknown)
  const viewerTz = url.searchParams.get("viewerTz") ?? "America/Los_Angeles";
  const dateParam = url.searchParams.get("date") ?? DateTime.now().setZone(viewerTz).toFormat("yyyy-LL-dd");

  // ---- Disallow past and same-day (for BOTH LA & Manila) ----
  const nowLA = DateTime.now().setZone(LA_TZ);
  const nowPH = DateTime.now().setZone(PH_TZ);

  // Earliest allowed day is "tomorrow" in BOTH locales (i.e., the later of the two tomorrows)
  const earliestLA = nowLA.startOf("day").plus({ days: 1 });
  const earliestPH = nowPH.startOf("day").plus({ days: 1 });
  const earliestAllowed = DateTime.max(earliestLA, earliestPH); // pick the later “tomorrow”
  const earliestAllowedStartUTC = earliestAllowed.startOf("day").toUTC();

  // Requested day in viewer's tz
  const requestedDay = DateTime.fromISO(dateParam, { zone: viewerTz });
  const requestedStartUTC = requestedDay.startOf("day").toUTC();

  // If user asks for a day before earliestAllowed, return no slots (and tell UI the min date)
  if (requestedStartUTC < earliestAllowedStartUTC) {
    return NextResponse.json({
      date: requestedDay.toFormat("yyyy-LL-dd"),
      viewerTz,
      slotMinutes: SLOT_MIN,
      slots: [],
      earliestAllowedDate: earliestAllowed.setZone(viewerTz).toFormat("yyyy-LL-dd"),
      officeHours: { startHour: START, endHour: END, viewerTz },
    });
  }

  // ---- Build the day window in UTC for the requested viewer day ----
  const windowStart = requestedDay.startOf("day").toUTC();
  const windowEnd = requestedDay.endOf("day").toUTC();

  const timeMin = windowStart.toISO()!;
  const timeMax = windowEnd.toISO()!;

  // ---- Google Free/Busy ----
  const cal = calendarClient();
  const { data } = await cal.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
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

  // ---- Generate free slots (viewer TZ office hours only) ----
  const slots: string[] = [];
  let cursor = windowStart;
  while (cursor.plus({ minutes: SLOT_MIN }) <= windowEnd) {
    if (withinOfficeHours(cursor, viewerTz)) {
      const slot = Interval.fromDateTimes(cursor, cursor.plus({ minutes: SLOT_MIN }));
      const overlaps = busyIntervals.some((b) => b.overlaps(slot));
      if (!overlaps) {
        slots.push(cursor.toISO()!); // keep in ISO UTC; UI can format in viewerTz
      }
    }
    cursor = cursor.plus({ minutes: SLOT_MIN });
  }

  return NextResponse.json({
    date: requestedDay.toFormat("yyyy-LL-dd"),
    viewerTz,
    slotMinutes: SLOT_MIN,
    slots,
    earliestAllowedDate: earliestAllowed.setZone(viewerTz).toFormat("yyyy-LL-dd"),
    officeHours: { startHour: START, endHour: END, viewerTz },
  });
}