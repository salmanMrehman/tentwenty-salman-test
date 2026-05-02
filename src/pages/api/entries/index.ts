import type { NextApiRequest, NextApiResponse } from "next";
import { fail, ok, withAuth } from "@helpers/apiHandler";
import { isDateInRange } from "@helpers/date";
import { sumEntryHours } from "@helpers/status";
import { validateEntry } from "@helpers/validation";
import { MOCK_PROJECTS } from "@mocks/projects";
import {
  getEntriesForWeek,
  getWeekById,
  insertEntry,
} from "@mocks/timesheets";
import { ApiResponse } from "@types-app/api.types";
import {
  EntryFormValues,
  TimesheetEntry,
} from "@types-app/timesheet.types";

/**
 * POST /api/entries
 *
 * Body: EntryFormValues + `weekId`.
 *
 * Creates a new timesheet entry under the requested week. Validates:
 *   - All required fields present.
 *   - Hours are within per-entry and per-week caps.
 *   - The chosen date falls inside the requested week.
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TimesheetEntry>>,
) {
  if (req.method !== "POST") {
    fail(res, 405, "METHOD_NOT_ALLOWED", `Method ${req.method} not allowed`);
    return;
  }

  const body = (req.body ?? {}) as Partial<EntryFormValues> & { weekId?: string };
  const weekId = body.weekId;

  if (!weekId) {
    fail(res, 400, "BAD_REQUEST", "Missing weekId.");
    return;
  }

  const week = getWeekById(weekId);
  if (!week) {
    fail(res, 404, "NOT_FOUND", "Week not found.");
    return;
  }

  // Date must fall inside the requested week.
  if (!body.date || !isDateInRange(body.date, week.startDate, week.endDate)) {
    fail(res, 400, "INVALID_DATE", "Date must be within the selected week.", {
      date: "Pick a date inside this week.",
    });
    return;
  }

  // Validate everything else (project, work type, description, hours).
  const loggedHours = sumEntryHours(getEntriesForWeek(weekId));
  const errors = validateEntry(body, {
    loggedHoursExcludingThis: loggedHours,
  });

  if (Object.keys(errors).length > 0) {
    fail(
      res,
      400,
      "VALIDATION",
      "Please fix the highlighted fields.",
      errors as Record<string, string>,
    );
    return;
  }

  const project = MOCK_PROJECTS.find((p) => p.id === body.projectId);
  if (!project) {
    fail(res, 400, "INVALID_PROJECT", "Selected project does not exist.", {
      projectId: "Choose a project from the list.",
    });
    return;
  }

  const newEntry: TimesheetEntry = {
    id: `entry-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    weekId,
    date: body.date as string,
    projectId: project.id,
    projectName: project.name,
    workType: body.workType!,
    description: (body.description ?? "").trim(),
    hours: Number(body.hours),
  };

  insertEntry(newEntry);
  ok(res, newEntry, 201);
}

export default withAuth(handler);
