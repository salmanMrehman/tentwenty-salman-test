/**
 * Lightweight date helpers.
 *
 * These intentionally avoid bringing in date-fns / dayjs - the app needs
 * only a handful of operations and we'd rather keep the bundle small.
 *
 * All "ISO date" strings here are the date-only `yyyy-MM-dd` format.
 */

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** `2024-01-21` -> `Jan 21`. */
export function formatShortDate(iso: string): string {
  const d = parseIsoDate(iso);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format a week's range exactly as in the design:
 *  - Same month: `1 - 5 January, 2024`
 *  - Cross month: `28 January - 1 February, 2024`
 *  - Cross year: `30 December, 2023 - 5 January, 2024`
 */
export function formatWeekRange(startIso: string, endIso: string): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()} - ${end.getDate()} ${
      MONTHS_LONG[start.getMonth()]
    }, ${start.getFullYear()}`;
  }

  if (sameYear) {
    return `${start.getDate()} ${MONTHS_LONG[start.getMonth()]} - ${end.getDate()} ${
      MONTHS_LONG[end.getMonth()]
    }, ${start.getFullYear()}`;
  }

  return `${start.getDate()} ${MONTHS_LONG[start.getMonth()]}, ${start.getFullYear()} - ${end.getDate()} ${
    MONTHS_LONG[end.getMonth()]
  }, ${end.getFullYear()}`;
}

/** Parse `yyyy-MM-dd` as a *local* date (avoids UTC off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Inverse of `parseIsoDate`. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns true if `iso` is within the inclusive `[start, end]` range. */
export function isDateInRange(
  iso: string,
  start?: string,
  end?: string,
): boolean {
  if (!start && !end) return true;
  const target = parseIsoDate(iso).getTime();
  if (start && target < parseIsoDate(start).getTime()) return false;
  if (end && target > parseIsoDate(end).getTime()) return false;
  return true;
}

/**
 * Returns true if a week (`weekStart`..`weekEnd`) overlaps a filter
 * range (`rangeStart`..`rangeEnd`). Either side can be undefined.
 *
 * The dashboard uses this for the "Date Range" filter: if the user
 * picks a range that spans multiple weeks, *all* of those weeks must
 * appear in the result (per the spec).
 */
export function doesWeekOverlapRange(
  weekStart: string,
  weekEnd: string,
  rangeStart?: string,
  rangeEnd?: string,
): boolean {
  const ws = parseIsoDate(weekStart).getTime();
  const we = parseIsoDate(weekEnd).getTime();
  const rs = rangeStart ? parseIsoDate(rangeStart).getTime() : -Infinity;
  const re = rangeEnd ? parseIsoDate(rangeEnd).getTime() : Infinity;
  return ws <= re && we >= rs;
}
