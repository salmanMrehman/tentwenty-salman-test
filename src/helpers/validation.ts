import {
  DESCRIPTION_MAX_LENGTH,
  ENTRY_HOURS_MAX,
  ENTRY_HOURS_MIN,
} from "@constants/timesheet";
import { APP_STRINGS } from "@constants/strings";
import {
  EntryFormErrors,
  EntryFormValues,
  LoginFormErrors,
} from "@types-app/index";

/**
 * Form validation lives in helpers (and not inside components) so we can
 * unit-test it cheaply and reuse the same rules on the API side.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = APP_STRINGS.login.emailRequired;
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = APP_STRINGS.login.emailInvalid;
  }

  if (!password) {
    errors.password = APP_STRINGS.login.passwordRequired;
  } else if (password.length < 6) {
    errors.password = APP_STRINGS.login.passwordTooShort;
  }

  return errors;
}

export interface EntryValidationContext {
  /**
   * Hours already logged in this week, *excluding* the entry being edited.
   * Used to enforce the weekly 40h ceiling.
   */
  loggedHoursExcludingThis: number;
  /** Maximum total per week. Defaults to 40. */
  weeklyMax?: number;
}

export function validateEntry(
  values: Partial<EntryFormValues>,
  context: EntryValidationContext,
): EntryFormErrors {
  const errors: EntryFormErrors = {};
  const m = APP_STRINGS.entryModal;

  if (!values.projectId) errors.projectId = m.projectRequired;
  if (!values.workType) errors.workType = m.workTypeRequired;

  const description = (values.description ?? "").trim();
  if (!description) {
    errors.description = m.descriptionRequired;
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = m.descriptionTooLong;
  }

  const hours = Number(values.hours);
  if (!hours || Number.isNaN(hours)) {
    errors.hours = m.hoursRequired;
  } else if (hours < ENTRY_HOURS_MIN) {
    errors.hours = m.hoursMin;
  } else if (hours > ENTRY_HOURS_MAX) {
    errors.hours = m.hoursMax;
  } else {
    const weeklyMax = context.weeklyMax ?? 40;
    const remaining = weeklyMax - context.loggedHoursExcludingThis;
    if (hours > remaining) {
      errors.hours = m.hoursWeeklyMax(Math.max(remaining, 0));
    }
  }

  return errors;
}

/**
 * Returns true if any value in the error map is truthy.
 *
 * Accepts any record shape — useful with our typed `*FormErrors`
 * interfaces which only have optional string fields.
 */
export function hasErrors(errors: object): boolean {
  return Object.values(errors).some(Boolean);
}
