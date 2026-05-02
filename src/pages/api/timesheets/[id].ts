import type { NextApiRequest, NextApiResponse } from "next";
import { fail, ok, withAuth } from "@helpers/apiHandler";
import { deriveStatusFromHours, sumEntryHours } from "@helpers/status";
import {
  getEntriesForWeek,
  getWeekById,
} from "@mocks/timesheets";
import { ApiResponse } from "@types-app/api.types";
import { WeeklyTimesheetDetail } from "@types-app/timesheet.types";

/**
 * GET /api/timesheets/:id
 *
 * Returns the full week detail (summary metadata + entries).
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<WeeklyTimesheetDetail>>,
) {
  if (req.method !== "GET") {
    fail(res, 405, "METHOD_NOT_ALLOWED", `Method ${req.method} not allowed`);
    return;
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) {
    fail(res, 400, "BAD_REQUEST", "Missing week id.");
    return;
  }

  const week = getWeekById(id);
  if (!week) {
    fail(res, 404, "NOT_FOUND", "Week not found.");
    return;
  }

  const entries = getEntriesForWeek(id);
  const totalHours = sumEntryHours(entries);

  ok(res, {
    id: week.id,
    weekNumber: week.weekNumber,
    startDate: week.startDate,
    endDate: week.endDate,
    totalHours,
    status: deriveStatusFromHours(totalHours),
    entries,
  });
}

export default withAuth(handler);
