import type { NextApiRequest, NextApiResponse } from "next";
import { fail, ok, withAuth } from "@helpers/apiHandler";
import { isDateInRange } from "@helpers/date";
import { sumEntryHours } from "@helpers/status";
import { validateEntry } from "@helpers/validation";
import { MOCK_PROJECTS } from "@mocks/projects";
import {
  deleteEntry,
  findEntry,
  getEntriesForWeek,
  getWeekById,
  updateEntry,
} from "@mocks/timesheets";
import { ApiResponse } from "@types-app/api.types";
import {
  EntryFormValues,
  TimesheetEntry,
} from "@types-app/timesheet.types";

/**
 * Routes for a single entry by id.
 *   PATCH  /api/entries/:id   - update fields
 *   DELETE /api/entries/:id   - remove the entry
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TimesheetEntry | { id: string }>>,
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) {
    fail(res, 400, "BAD_REQUEST", "Missing entry id.");
    return;
  }

  const existing = findEntry(id);
  if (!existing) {
    fail(res, 404, "NOT_FOUND", "Entry not found.");
    return;
  }

  if (req.method === "DELETE") {
    deleteEntry(id);
    ok(res, { id });
    return;
  }

  if (req.method === "PATCH") {
    const body = (req.body ?? {}) as Partial<EntryFormValues>;

    const week = getWeekById(existing.weekId);
    if (!week) {
      fail(res, 404, "NOT_FOUND", "Week not found.");
      return;
    }

    // Compose the candidate values for validation; allow callers to send
    // a partial patch (e.g. just hours).
    const candidate: Partial<EntryFormValues> = {
      projectId: body.projectId ?? existing.projectId,
      workType: body.workType ?? existing.workType,
      description: body.description ?? existing.description,
      hours: body.hours ?? existing.hours,
      date: body.date ?? existing.date,
    };

    if (
      candidate.date &&
      !isDateInRange(candidate.date, week.startDate, week.endDate)
    ) {
      fail(res, 400, "INVALID_DATE", "Date must be within the entry's week.", {
        date: "Pick a date inside this week.",
      });
      return;
    }

    const otherEntries = getEntriesForWeek(existing.weekId).filter(
      (e) => e.id !== id,
    );
    const errors = validateEntry(candidate, {
      loggedHoursExcludingThis: sumEntryHours(otherEntries),
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

    const project = MOCK_PROJECTS.find((p) => p.id === candidate.projectId);
    if (!project) {
      fail(res, 400, "INVALID_PROJECT", "Selected project does not exist.", {
        projectId: "Choose a project from the list.",
      });
      return;
    }

    const updated = updateEntry(id, {
      projectId: project.id,
      projectName: project.name,
      workType: candidate.workType,
      description: (candidate.description ?? "").trim(),
      hours: Number(candidate.hours),
      date: candidate.date,
    });

    if (!updated) {
      fail(res, 500, "UPDATE_FAILED", "Could not update entry.");
      return;
    }

    ok(res, updated);
    return;
  }

  fail(res, 405, "METHOD_NOT_ALLOWED", `Method ${req.method} not allowed`);
}

export default withAuth(handler);
