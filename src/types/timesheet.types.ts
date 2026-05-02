/**
 * Domain types for the timesheet app.
 *
 * Status semantics (from the brief):
 *  - completed:  user logged exactly 40 hours for the week
 *  - incomplete: user logged > 0 but < 40 hours
 *  - missing:    user logged no hours
 *
 * Status is *derived* from the entries on the server side so that any
 * mutation (add/edit/delete) automatically rolls up to the right value.
 */

export const TimesheetStatus = {
  Completed: "completed",
  Incomplete: "incomplete",
  Missing: "missing",
} as const;

export type TimesheetStatus =
  (typeof TimesheetStatus)[keyof typeof TimesheetStatus];

/** A single time entry that lives under a specific date. */
export interface TimesheetEntry {
  id: string;
  weekId: string;
  date: string; // ISO yyyy-MM-dd
  projectId: string;
  projectName: string;
  workType: WorkType;
  description: string;
  hours: number;
}

export const WorkType = {
  BugFixes: "bug_fixes",
  Feature: "feature",
  Research: "research",
  Meeting: "meeting",
  Other: "other",
} as const;

export type WorkType = (typeof WorkType)[keyof typeof WorkType];

/** Summary row for the dashboard list/table. */
export interface WeeklyTimesheet {
  id: string;
  weekNumber: number;
  /** Inclusive ISO start date (Monday). */
  startDate: string;
  /** Inclusive ISO end date (Friday). */
  endDate: string;
  totalHours: number;
  status: TimesheetStatus;
}

/** Detailed week view used by the per-week page. */
export interface WeeklyTimesheetDetail extends WeeklyTimesheet {
  entries: TimesheetEntry[];
}

export interface Project {
  id: string;
  name: string;
}

/** Filters used on the dashboard. */
export interface TimesheetFilters {
  /** ISO date string, inclusive. */
  startDate?: string;
  /** ISO date string, inclusive. */
  endDate?: string;
  status?: TimesheetStatus | "all";
}

/** Pagination metadata returned by the list endpoint. */
export interface PageInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTimesheets {
  data: WeeklyTimesheet[];
  pageInfo: PageInfo;
}

/** Payload accepted by the entry create/update endpoints. */
export interface EntryFormValues {
  projectId: string;
  workType: WorkType;
  description: string;
  hours: number;
  date: string;
}

export interface EntryFormErrors {
  projectId?: string;
  workType?: string;
  description?: string;
  hours?: string;
  date?: string;
}
