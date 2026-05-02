import { TimesheetStatus, WorkType } from "@types-app/timesheet.types";
import { APP_STRINGS } from "./strings";

/**
 * Domain-level constants for the timesheet feature.
 *
 * Anything that's a "magic number" or "magic string" - the weekly target,
 * status -> label maps, work type options - lives here.
 */

/** Hours required to mark a week as completed. */
export const WEEKLY_HOURS_TARGET = 40;

/** Single-entry caps to keep the UI sane. */
export const ENTRY_HOURS_MIN = 1;
export const ENTRY_HOURS_MAX = 24;

/** Description length cap (must match server validation). */
export const DESCRIPTION_MAX_LENGTH = 500;

/** Pagination defaults. */
export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE = 1;

/** Maps a status enum to its display string. */
export const STATUS_LABELS: Record<TimesheetStatus, string> = {
  [TimesheetStatus.Completed]: APP_STRINGS.status.completed,
  [TimesheetStatus.Incomplete]: APP_STRINGS.status.incomplete,
  [TimesheetStatus.Missing]: APP_STRINGS.status.missing,
};

/** Maps a status enum to the action verb shown in the dashboard table. */
export const STATUS_ACTION_LABELS: Record<TimesheetStatus, string> = {
  [TimesheetStatus.Completed]: APP_STRINGS.dashboard.actionView,
  [TimesheetStatus.Incomplete]: APP_STRINGS.dashboard.actionUpdate,
  [TimesheetStatus.Missing]: APP_STRINGS.dashboard.actionCreate,
};

/** Options for a status filter dropdown (with an "all" pseudo-value). */
export const STATUS_FILTER_OPTIONS: Array<{
  value: TimesheetStatus | "all";
  label: string;
}> = [
  { value: "all", label: APP_STRINGS.dashboard.filterStatusAll },
  { value: TimesheetStatus.Completed, label: APP_STRINGS.status.completed },
  { value: TimesheetStatus.Incomplete, label: APP_STRINGS.status.incomplete },
  { value: TimesheetStatus.Missing, label: APP_STRINGS.status.missing },
];

/** Options for the "Type of Work" select inside the entry modal. */
export const WORK_TYPE_OPTIONS: Array<{
  value: WorkType;
  label: string;
}> = [
  { value: WorkType.BugFixes, label: APP_STRINGS.workTypeLabels.bug_fixes },
  { value: WorkType.Feature, label: APP_STRINGS.workTypeLabels.feature },
  { value: WorkType.Research, label: APP_STRINGS.workTypeLabels.research },
  { value: WorkType.Meeting, label: APP_STRINGS.workTypeLabels.meeting },
  { value: WorkType.Other, label: APP_STRINGS.workTypeLabels.other },
];
