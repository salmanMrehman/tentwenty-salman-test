import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@helpers/classNames";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Marks the field with a `*` next to the label. */
  required?: boolean;
}

/**
 * Labelled text input with built-in error/hint slots.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, className, id, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedBy = error
    ? `${inputId}-error`
    : hint
    ? `${inputId}-hint`
    : undefined;

  return (
    <div className={cn(styles.field, className)}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? <span className={styles.requiredMark}> *</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(styles.input, error && styles.inputError)}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
