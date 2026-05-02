import {
  TimesheetEntry,
  WeeklyTimesheet,
  WorkType,
} from "@types-app/timesheet.types";
import { deriveStatusFromHours, sumEntryHours } from "@helpers/status";
import { toIsoDate } from "@helpers/date";
import { MOCK_PROJECTS } from "./projects";

/**
 * Mock dataset.
 *
 * The dashboard wants a long list (the design shows up to page 99) so we
 * generate weeks programmatically and seed varied entries to exercise
 * the three statuses (completed / incomplete / missing).
 */

// ---------------------------------------------------------------------
// Week generation
// ---------------------------------------------------------------------

const TOTAL_WEEKS = 99;
const FIRST_MONDAY = new Date(2024, 0, 1); // Mon Jan 1 2024

interface RawWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
}

function buildWeeks(): RawWeek[] {
  const weeks: RawWeek[] = [];
  const cursor = new Date(FIRST_MONDAY);
  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 4); // Mon..Fri (work week)
    weeks.push({
      id: `week-${i}`,
      weekNumber: i,
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
    });
    cursor.setDate(cursor.getDate() + 7);
  }
  return weeks;
}

const RAW_WEEKS = buildWeeks();

// ---------------------------------------------------------------------
// Entry seeding
// ---------------------------------------------------------------------

const SAMPLE_DESCRIPTIONS = [
  "Homepage Development",
  "Implemented hero section",
  "Refactored API client",
  "Investigated session bug",
  "Pair-programming with QA",
  "Wrote unit tests",
  "Added analytics events",
  "Reviewed PRs",
];

const SAMPLE_WORK_TYPES: WorkType[] = [
  WorkType.Feature,
  WorkType.BugFixes,
  WorkType.Research,
  WorkType.Meeting,
  WorkType.Other,
];

/**
 * Deterministic-ish helper so the mock data is stable between runs.
 */
function pseudoRandom(seed: number): number {
  // Simple LCG. Not cryptographic; we just need stable variety.
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

/**
 * For each week, decide a "fill mode":
 *  - 0: missing (no entries)
 *  - 1: incomplete (1..3 days, partial hours)
 *  - 2: completed (5 days x 8 hours = 40)
 */
function fillModeForWeek(weekNumber: number): 0 | 1 | 2 {
  // Mix of statuses across weeks, biased toward "completed".
  const r = pseudoRandom(weekNumber);
  if (r < 0.15) return 0;
  if (r < 0.4) return 1;
  return 2;
}

function buildEntriesForWeek(week: RawWeek): TimesheetEntry[] {
  const mode = fillModeForWeek(week.weekNumber);
  if (mode === 0) return [];

  const entries: TimesheetEntry[] = [];
  const start = new Date(week.startDate);

  // 5-day work week: Mon..Fri
  const dayCount = mode === 2 ? 5 : 1 + Math.floor(pseudoRandom(week.weekNumber + 7) * 3);
  const hoursPerDay = mode === 2 ? 8 : 4;
  const tasksPerDay = mode === 2 ? 2 : 1;

  for (let d = 0; d < dayCount; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dateIso = toIsoDate(date);

    // Split daily hours across `tasksPerDay` entries.
    const perTask = hoursPerDay / tasksPerDay;
    for (let t = 0; t < tasksPerDay; t++) {
      const seed = week.weekNumber * 100 + d * 10 + t;
      const project = MOCK_PROJECTS[Math.floor(pseudoRandom(seed) * MOCK_PROJECTS.length)];
      const workType =
        SAMPLE_WORK_TYPES[Math.floor(pseudoRandom(seed + 1) * SAMPLE_WORK_TYPES.length)];
      const description =
        SAMPLE_DESCRIPTIONS[Math.floor(pseudoRandom(seed + 2) * SAMPLE_DESCRIPTIONS.length)];
      entries.push({
        id: `entry-${week.weekNumber}-${d}-${t}`,
        weekId: week.id,
        date: dateIso,
        projectId: project.id,
        projectName: project.name,
        workType,
        description,
        hours: perTask,
      });
    }
  }

  return entries;
}

// ---------------------------------------------------------------------
// Aggregated mock store
// ---------------------------------------------------------------------

/**
 * Mutable in-memory store. Simulates a DB so add/edit/delete actions
 * persist for the lifetime of the dev server.
 *
 * Exported as `let` references; consumers should always go through the
 * helper functions below to avoid cross-module mutation hazards.
 */
let entries: TimesheetEntry[] = RAW_WEEKS.flatMap(buildEntriesForWeek);

export function getAllEntries(): TimesheetEntry[] {
  return entries;
}

export function getEntriesForWeek(weekId: string): TimesheetEntry[] {
  return entries.filter((e) => e.weekId === weekId);
}

export function findEntry(id: string): TimesheetEntry | undefined {
  return entries.find((e) => e.id === id);
}

export function insertEntry(entry: TimesheetEntry): void {
  entries = [...entries, entry];
}

export function updateEntry(
  id: string,
  patch: Partial<TimesheetEntry>,
): TimesheetEntry | undefined {
  let next: TimesheetEntry | undefined;
  entries = entries.map((e) => {
    if (e.id !== id) return e;
    next = { ...e, ...patch };
    return next;
  });
  return next;
}

export function deleteEntry(id: string): boolean {
  const before = entries.length;
  entries = entries.filter((e) => e.id !== id);
  return entries.length < before;
}

/**
 * Roll up entries into a list of weekly summaries used by the dashboard.
 * Status is derived from total hours, never persisted, which guarantees
 * it stays consistent after CRUD operations.
 */
export function getWeeklySummaries(): WeeklyTimesheet[] {
  return RAW_WEEKS.map((w) => {
    const weekEntries = getEntriesForWeek(w.id);
    const totalHours = sumEntryHours(weekEntries);
    return {
      id: w.id,
      weekNumber: w.weekNumber,
      startDate: w.startDate,
      endDate: w.endDate,
      totalHours,
      status: deriveStatusFromHours(totalHours),
    };
  });
}

export function getWeekById(weekId: string): RawWeek | undefined {
  return RAW_WEEKS.find((w) => w.id === weekId);
}
