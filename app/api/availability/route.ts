import { NextRequest, NextResponse } from "next/server";
import { calendarClient } from "../../lib/google";
import { DateTime, Interval } from "luxon";
import type { calendar_v3 } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLOT_MIN = 30;
const START = Number(process.env.WORK_START_HOUR || 9);
const END   = Number(process.env.WORK_END_HOUR || 18);

const LA_TZ = process.env.LA_TZ || "America/Los_Angeles";
const PH_TZ = process.env.PH_TZ || "Asia/Manila";

function isTimePeriod(
  tp: calendar_v3.Schema$TimePeriod | undefined
): tp is calendar_v3.Schema$TimePeriod {
  return !!tp && !!tp.start && !!tp.end;
}

/** Next business day in tz, skipping Sundays. */
function nextBusinessDateInTz(now: DateTime, tz: string) {
  let d = now.setZone(tz).startOf("day").plus({ days: 1 });
  if (d.weekday === 7) d = d.plus({ days: 1 }); // 7 = Sunday
  return d;
}

/** True if the given UTC instant falls within [START, END) of the office day in officeTz. */
function withinOfficeHoursUTC(dtUTC: DateTime, officeTz: string) {
  const local = dtUTC.setZone(officeTz);
  if (local.weekday === 7) return false; // Sunday
  const minutes = local.hour * 60 + local.minute;
  const startMin = START * 60;
  const endMin   = END   * 60;
  // Slot must fit fully before END
  return minutes >= startMin && minutes + SLOT_MIN <= endMin;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Viewer timezone from client (fallback LA)
  const viewerTz =
    url.searchParams.get("viewerTz") ??
    "America/Los_Angeles";

  // Decide which office window to use:
  // - If viewer is in PH -> use PH office hours
  // - Else -> use LA office hours
  const isPHViewer =
    viewerTz === PH_TZ || viewerTz.startsWith("Asia/Manila");

  const officeTz = isPHViewer ? PH_TZ : LA_TZ;

  // Date param interpreted as a day in the **office timezone**
  const dateParam =
    url.searchParams.get("date") ??
    DateTime.now().setZone(officeTz).toFormat("yyyy-LL-dd");

  const requestedOfficeDay = DateTime.fromISO(dateParam, { zone: officeTz }).startOf("day");

  // Block Sundays entirely
  if (requestedOfficeDay.weekday === 7) {
    const earliestAllowed = nextBusinessDateInTz(DateTime.now(), officeTz);
    return NextResponse.json({
      date: requestedOfficeDay.toFormat("yyyy-LL-dd"),
      viewerTz,
      officeTz,
      slotMinutes: SLOT_MIN,
      slots: [],
      earliestAllowedDate: earliestAllowed.setZone(viewerTz).toFormat("yyyy-LL-dd"),
      officeHours: { startHour: START, endHour: END, officeTz },
      reason: "sunday_closed",
    });
  }

  // Disallow same-day: earliest is next business day in the **office timezone**
  const earliestAllowed = nextBusinessDateInTz(DateTime.now(), officeTz);
  const earliestAllowedStartUTC = earliestAllowed.toUTC();

  const requestedStartUTC = requestedOfficeDay.toUTC();
  if (requestedStartUTC < earliestAllowedStartUTC) {
    return NextResponse.json({
      date: requestedOfficeDay.toFormat("yyyy-LL-dd"),
      viewerTz,
      officeTz,
      slotMinutes: SLOT_MIN,
      slots: [],
      earliestAllowedDate: earliestAllowed.setZone(viewerTz).toFormat("yyyy-LL-dd"),
      officeHours: { startHour: START, endHour: END, officeTz },
      reason: "before_earliest_allowed",
    });
  }

  // Query Google Free/Busy for the whole requested office day (UTC window)
  const windowStartUTC = requestedOfficeDay.startOf("day").toUTC();
  const windowEndUTC   = requestedOfficeDay.endOf("day").toUTC();

  const cal = calendarClient();
  const { data } = await cal.freebusy.query({
    requestBody: {
      timeMin: windowStartUTC.toISO()!,
      timeMax: windowEndUTC.toISO()!,
      timeZone: "UTC",
      items: [
        { id: process.env.MAIN_CALENDAR_ID! },
        { id: process.env.HOLDS_CALENDAR_ID! },
      ],
    },
  });

  const calendars: Record<string, calendar_v3.Schema$FreeBusyCalendar> =
    (data.calendars as Record<string, calendar_v3.Schema$FreeBusyCalendar>) ?? {};

  const busyIntervals: Interval[] = Object.values(calendars)
    .flatMap((c) => (c.busy ?? []))
    .filter(isTimePeriod)
    .map((b) =>
      Interval.fromDateTimes(
        DateTime.fromISO(b.start!, { zone: "utc" }),
        DateTime.fromISO(b.end!,   { zone: "utc" })
      )
    );

  // Generate slots: step through the UTC day, keep those inside office hours in officeTz
  const slots: string[] = [];
  let cursor = windowStartUTC;
  while (cursor.plus({ minutes: SLOT_MIN }) <= windowEndUTC) {
    if (withinOfficeHoursUTC(cursor, officeTz)) {
      const slot = Interval.fromDateTimes(cursor, cursor.plus({ minutes: SLOT_MIN }));
      const overlaps = busyIntervals.some((b) => b.overlaps(slot));
      if (!overlaps) slots.push(cursor.toISO()!); // keep in UTC
    }
    cursor = cursor.plus({ minutes: SLOT_MIN });
  }

  return NextResponse.json({
    date: requestedOfficeDay.toFormat("yyyy-LL-dd"),
    viewerTz,
    officeTz,
    slotMinutes: SLOT_MIN,
    slots,
    earliestAllowedDate: earliestAllowed.setZone(viewerTz).toFormat("yyyy-LL-dd"),
    officeHours: { startHour: START, endHour: END, officeTz },
  });
}
