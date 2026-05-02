import { TimesheetStatus } from "@types-app/timesheet.types";
import { WEEKLY_HOURS_TARGET } from "@constants/timesheet";

/**
 * Pure status logic, derived from total hours.
 *
 * Kept separate so it can be unit tested without React.
 */

export function deriveStatusFromHours(totalHours: number): TimesheetStatus {
  if (totalHours <= 0) return TimesheetStatus.Missing;
  if (totalHours >= WEEKLY_HOURS_TARGET) return TimesheetStatus.Completed;
  return TimesheetStatus.Incomplete;
}

export function sumEntryHours(entries: Array<{ hours: number }>): number {
  return entries.reduce((acc, e) => acc + (Number(e.hours) || 0), 0);
}
