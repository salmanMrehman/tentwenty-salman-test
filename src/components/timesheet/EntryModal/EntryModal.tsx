import { FormEvent, useEffect, useMemo, useState } from "react";
import { Modal } from "@components/common/Modal/Modal";
import { Select } from "@components/common/Select/Select";
import { Textarea } from "@components/common/Textarea/Textarea";
import { NumberStepper } from "@components/common/NumberStepper/NumberStepper";
import { Button } from "@components/common/Button/Button";
import { APP_STRINGS } from "@constants/strings";
import {
  ENTRY_HOURS_MAX,
  ENTRY_HOURS_MIN,
  WEEKLY_HOURS_TARGET,
  WORK_TYPE_OPTIONS,
} from "@constants/timesheet";
import { hasErrors, validateEntry } from "@helpers/validation";
import {
  EntryFormErrors,
  EntryFormValues,
  Project,
  TimesheetEntry,
  WorkType,
} from "@types-app/timesheet.types";
import styles from "./EntryModal.module.css";

export interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Entry being edited; `null` means we're in "add" mode. */
  editing: TimesheetEntry | null;
  /** Date used when adding a new entry. */
  defaultDate: string;
  projects: Project[];
  /** Hours already logged in the entire week (excluding the entry being edited). */
  loggedHoursExcludingThis: number;
  onSubmit: (values: EntryFormValues, editingId?: string) => Promise<void> | void;
  /** Server-side validation errors to surface at the field level. */
  serverErrors?: EntryFormErrors;
  isSubmitting?: boolean;
  /** Top-level form error (e.g. network failure). */
  formError?: string | null;
}

interface FormState {
  projectId: string;
  workType: WorkType | "";
  description: string;
  hours: number;
  date: string;
}

const EMPTY_FORM: FormState = {
  projectId: "",
  workType: "",
  description: "",
  hours: 1,
  date: "",
};

/**
 * Add / Edit entry modal.
 *
 * One component covers both flows; the only difference is whether
 * `editing` is set. We initialise local state from `editing` (or empty
 * defaults) every time the modal opens, then trust local state for the
 * lifetime of the modal — keeps controlled inputs predictable.
 */
export function EntryModal({
  isOpen,
  onClose,
  editing,
  defaultDate,
  projects,
  loggedHoursExcludingThis,
  onSubmit,
  serverErrors,
  isSubmitting,
  formError,
}: EntryModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<EntryFormErrors>({});

  // Hydrate the form whenever the modal opens (or the target entry changes).
  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setForm({
        projectId: editing.projectId,
        workType: editing.workType,
        description: editing.description,
        hours: editing.hours,
        date: editing.date,
      });
    } else {
      setForm({ ...EMPTY_FORM, date: defaultDate });
    }
    setErrors({});
  }, [isOpen, editing, defaultDate]);

  // Merge server errors when they arrive.
  useEffect(() => {
    if (serverErrors) setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  const projectOptions = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values: Partial<EntryFormValues> = {
      projectId: form.projectId || undefined,
      workType: (form.workType || undefined) as WorkType | undefined,
      description: form.description,
      hours: form.hours,
      date: form.date,
    };

    const localErrors = validateEntry(values, {
      loggedHoursExcludingThis,
      weeklyMax: WEEKLY_HOURS_TARGET,
    });

    setErrors(localErrors);
    if (hasErrors(localErrors)) return;

    await onSubmit(values as EntryFormValues, editing?.id);
  };

  const remaining = Math.max(
    0,
    WEEKLY_HOURS_TARGET - loggedHoursExcludingThis,
  );
  const stepperMax = Math.min(ENTRY_HOURS_MAX, Math.max(ENTRY_HOURS_MIN, remaining || ENTRY_HOURS_MIN));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editing
          ? APP_STRINGS.entryModal.titleEdit
          : APP_STRINGS.entryModal.titleAdd
      }
      footer={
        <>
          <Button
            type="submit"
            form="entry-form"
            isLoading={isSubmitting}
            fullWidth
          >
            {editing
              ? APP_STRINGS.entryModal.submitEdit
              : APP_STRINGS.entryModal.submitAdd}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            {APP_STRINGS.entryModal.cancel}
          </Button>
        </>
      }
    >
      <form
        id="entry-form"
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
      >
        {formError ? (
          <div role="alert" className={styles.formError}>
            {formError}
          </div>
        ) : null}

        <Select
          label={APP_STRINGS.entryModal.projectLabel}
          required
          placeholder={APP_STRINGS.entryModal.projectPlaceholder}
          hint={APP_STRINGS.entryModal.projectHint}
          options={projectOptions}
          value={form.projectId}
          onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          error={errors.projectId}
        />

        <Select
          label={APP_STRINGS.entryModal.workTypeLabel}
          required
          placeholder={APP_STRINGS.workTypeLabels.bug_fixes}
          hint={APP_STRINGS.entryModal.workTypeHint}
          options={WORK_TYPE_OPTIONS}
          value={form.workType}
          onChange={(e) =>
            setForm({ ...form, workType: e.target.value as WorkType })
          }
          error={errors.workType}
        />

        <Textarea
          label={APP_STRINGS.entryModal.descriptionLabel}
          required
          placeholder={APP_STRINGS.entryModal.descriptionPlaceholder}
          hint={APP_STRINGS.entryModal.descriptionHint}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          error={errors.description}
        />

        <NumberStepper
          label={APP_STRINGS.entryModal.hoursLabel}
          required
          value={form.hours}
          onChange={(v) => setForm({ ...form, hours: v })}
          min={ENTRY_HOURS_MIN}
          max={stepperMax}
          error={errors.hours}
        />
      </form>
    </Modal>
  );
}
