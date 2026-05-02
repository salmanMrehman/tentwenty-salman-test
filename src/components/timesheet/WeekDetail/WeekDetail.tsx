import { useMemo, useState } from "react";
import { ProgressBar } from "@components/common/ProgressBar/ProgressBar";
import { DayGroup } from "@components/timesheet/DayGroup/DayGroup";
import { EntryModal } from "@components/timesheet/EntryModal/EntryModal";
import { APP_STRINGS } from "@constants/strings";
import { WEEKLY_HOURS_TARGET } from "@constants/timesheet";
import { sumEntryHours } from "@helpers/status";
import { formatWeekRange, parseIsoDate, toIsoDate } from "@helpers/date";
import {
  MutationError,
  createEntryThunk,
  deleteEntryThunk,
  updateEntryThunk,
} from "@store/slices/weekDetailSlice";
import { useAppDispatch } from "@store/hooks";
import {
  EntryFormErrors,
  EntryFormValues,
  Project,
  TimesheetEntry,
  WeeklyTimesheetDetail,
} from "@types-app/timesheet.types";
import styles from "./WeekDetail.module.css";

export interface WeekDetailProps {
  data: WeeklyTimesheetDetail;
  projects: Project[];
  isMutating: boolean;
}

/**
 * The "this week's timesheet" view.
 *
 * Logic:
 *  1. Build a list of all 5 weekday dates (Mon..Fri) for the week.
 *  2. Group entries by date.
 *  3. Render a DayGroup per date so empty days still show "+ Add new task".
 *
 * Add / edit / delete dispatch through Redux thunks; server-side errors
 * are surfaced as inline form errors in the modal.
 */
export function WeekDetail({ data, projects, isMutating }: WeekDetailProps) {
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimesheetEntry | null>(null);
  const [modalDate, setModalDate] = useState<string>(data.startDate);
  const [serverErrors, setServerErrors] = useState<EntryFormErrors | undefined>();
  const [formError, setFormError] = useState<string | null>(null);

  // Build the list of days in the work week.
  const weekDays = useMemo(() => buildWeekDays(data.startDate, data.endDate), [
    data.startDate,
    data.endDate,
  ]);

  // Group entries by day.
  const entriesByDay = useMemo(() => {
    const map = new Map<string, TimesheetEntry[]>();
    weekDays.forEach((d) => map.set(d, []));
    data.entries.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [data.entries, weekDays]);

  const totalHours = sumEntryHours(data.entries);

  const handleAddClick = (date: string) => {
    setEditing(null);
    setModalDate(date);
    setServerErrors(undefined);
    setFormError(null);
    setModalOpen(true);
  };

  const handleEditClick = (entry: TimesheetEntry) => {
    setEditing(entry);
    setModalDate(entry.date);
    setServerErrors(undefined);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDeleteClick = async (entry: TimesheetEntry) => {
    // Use a native confirm for the demo; a real app would use a dialog.
    if (!window.confirm(APP_STRINGS.weekDetail.confirmDelete)) return;
    try {
      await dispatch(deleteEntryThunk(entry.id)).unwrap();
    } catch {
      // Errors are surfaced by the slice via mutating=false; the page
      // also has a top-level error banner driven by the same slice.
    }
  };

  const handleSubmit = async (values: EntryFormValues, editingId?: string) => {
    setServerErrors(undefined);
    setFormError(null);
    try {
      if (editingId) {
        await dispatch(
          updateEntryThunk({ id: editingId, values }),
        ).unwrap();
      } else {
        await dispatch(
          createEntryThunk({ weekId: data.id, values }),
        ).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      // Thunks reject with a `MutationError` (see weekDetailSlice).
      const mutErr = err as MutationError | undefined;
      if (mutErr?.fields) {
        setServerErrors(mutErr.fields as EntryFormErrors);
      } else {
        setFormError(mutErr?.message ?? "Could not save the entry.");
      }
    }
  };

  const loggedExcludingEditing = editing
    ? totalHours - editing.hours
    : totalHours;

  // The "active" dashed Add row from the design highlights the row the
  // mouse is over. We approximate that here by emphasising the *first*
  // empty day, matching how the screenshot looks.
  const firstEmptyDay = weekDays.find(
    (d) => (entriesByDay.get(d) ?? []).length === 0,
  );

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{APP_STRINGS.weekDetail.title}</h1>
          <p className={styles.range}>
            {formatWeekRange(data.startDate, data.endDate)}
          </p>
        </div>
        <ProgressBar
          value={totalHours}
          max={WEEKLY_HOURS_TARGET}
          topLabel={APP_STRINGS.weekDetail.progressLabel(
            totalHours,
            WEEKLY_HOURS_TARGET,
          )}
          endLabel={`${Math.round(
            (Math.min(totalHours, WEEKLY_HOURS_TARGET) /
              WEEKLY_HOURS_TARGET) *
              100,
          )}%`}
          className={styles.progress}
        />
      </header>

      <div className={styles.body}>
        {weekDays.map((d) => (
          <DayGroup
            key={d}
            date={d}
            entries={entriesByDay.get(d) ?? []}
            onAddEntry={handleAddClick}
            onEditEntry={handleEditClick}
            onDeleteEntry={handleDeleteClick}
            emphasiseAddRow={d === firstEmptyDay}
          />
        ))}
      </div>

      <EntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        defaultDate={modalDate}
        projects={projects}
        loggedHoursExcludingThis={loggedExcludingEditing}
        onSubmit={handleSubmit}
        serverErrors={serverErrors}
        formError={formError}
        isSubmitting={isMutating}
      />
    </section>
  );
}

/** Returns Mon..Fri as ISO date strings between (and including) the bounds. */
function buildWeekDays(startIso: string, endIso: string): string[] {
  const out: string[] = [];
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    out.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
