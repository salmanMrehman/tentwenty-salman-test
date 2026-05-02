import type { NextApiRequest, NextApiResponse } from "next";
import { fail, ok, withAuth } from "@helpers/apiHandler";
import { doesWeekOverlapRange } from "@helpers/date";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@constants/timesheet";
import { getWeeklySummaries } from "@mocks/timesheets";
import { ApiResponse } from "@types-app/api.types";
import {
  PaginatedTimesheets,
  TimesheetStatus,
} from "@types-app/timesheet.types";

/**
 * GET /api/timesheets
 *
 * Query parameters:
 *   page       - 1-based page number (default 1)
 *   perPage    - rows per page; must be one of PAGE_SIZE_OPTIONS
 *   startDate  - ISO date (yyyy-MM-dd), inclusive
 *   endDate    - ISO date (yyyy-MM-dd), inclusive
 *   status     - "all" | "completed" | "incomplete" | "missing"
 *
 * If `startDate`/`endDate` are provided, all weeks that *overlap* the
 * range are returned (matching the spec's "if the range covers multiple
 * weeks, show them all" rule).
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedTimesheets>>,
) {
  if (req.method !== "GET") {
    fail(res, 405, "METHOD_NOT_ALLOWED", `Method ${req.method} not allowed`);
    return;
  }

  const page = clampInt(req.query.page, DEFAULT_PAGE, 1, Number.MAX_SAFE_INTEGER);
  const perPageRaw = clampInt(
    req.query.perPage,
    DEFAULT_PAGE_SIZE,
    1,
    Number.MAX_SAFE_INTEGER,
  );
  const perPage = (PAGE_SIZE_OPTIONS as readonly number[]).includes(perPageRaw)
    ? perPageRaw
    : DEFAULT_PAGE_SIZE;

  const startDate = stringOrUndef(req.query.startDate);
  const endDate = stringOrUndef(req.query.endDate);
  const status = stringOrUndef(req.query.status) as
    | TimesheetStatus
    | "all"
    | undefined;

  let rows = getWeeklySummaries();

  // Filter: date range overlap (per spec)
  if (startDate || endDate) {
    rows = rows.filter((w) =>
      doesWeekOverlapRange(w.startDate, w.endDate, startDate, endDate),
    );
  }

  // Filter: status
  if (status && status !== "all") {
    rows = rows.filter((w) => w.status === status);
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const data = rows.slice(startIdx, startIdx + perPage);

  ok(res, {
    data,
    pageInfo: { page: safePage, perPage, total, totalPages },
  });
}

function clampInt(
  raw: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const v = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(v) || v < min) return fallback;
  return Math.min(Math.max(Math.floor(v), min), max);
}

function stringOrUndef(raw: unknown): string | undefined {
  if (Array.isArray(raw)) return raw[0];
  if (typeof raw === "string" && raw.length > 0) return raw;
  return undefined;
}

export default withAuth(handler);
