import { EntryRow } from "@components/timesheet/EntryRow/EntryRow";
import { AddTaskRow } from "@components/timesheet/AddTaskRow/AddTaskRow";
import { formatShortDate } from "@helpers/date";
import { TimesheetEntry } from "@types-app/timesheet.types";
import styles from "./DayGroup.module.css";

export interface DayGroupProps {
  date: string;
  entries: TimesheetEntry[];
  onAddEntry: (date: string) => void;
  onEditEntry: (entry: TimesheetEntry) => void;
  onDeleteEntry: (entry: TimesheetEntry) => void;
  /** When true, the add-row gets the "active" highlight from the design. */
  emphasiseAddRow?: boolean;
}

/**
 * One day's worth of entries (label on the left, list of entries +
 * "+ Add new task" row on the right).
 */
export function DayGroup({
  date,
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  emphasiseAddRow,
}: DayGroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.dateLabel}>{formatShortDate(date)}</div>
      <div className={styles.entries}>
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
          />
        ))}
        <AddTaskRow
          onClick={() => onAddEntry(date)}
          emphasised={emphasiseAddRow}
        />
      </div>
    </div>
  );
}
