import { TimesheetStatus } from "@types-app/timesheet.types";
import { STATUS_LABELS } from "@constants/timesheet";
import { cn } from "@helpers/classNames";
import styles from "./StatusBadge.module.css";

export interface StatusBadgeProps {
  status: TimesheetStatus;
  className?: string;
}

/**
 * Pill-style status badge that mirrors the design.
 *
 * Colours come from the status tokens, never inline.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[status], className)}
      aria-label={`Status: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
