import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@helpers/classNames";
import styles from "./Select.module.css";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  /** Shown when no value is selected. */
  placeholder?: string;
  required?: boolean;
}

/**
 * Native `<select>` styled to match the design.
 *
 * Sticking with native here keeps things accessible by default
 * (keyboard nav, screen reader support) without third-party deps.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      options,
      placeholder,
      required,
      className,
      id,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) {
    const reactId = useId();
    const selectId = id ?? `select-${reactId}`;
    const describedBy = error
      ? `${selectId}-error`
      : hint
      ? `${selectId}-hint`
      : undefined;

    // Empty selection shows the placeholder row. Keep it `disabled` so it
    // cannot be mistaken for a real choice and matches native UX patterns.
    const resolvedValue =
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : "";
    const showsPlaceholderRow =
      Boolean(placeholder) && String(resolvedValue ?? "") === "";

    return (
      <div className={cn(styles.field, className)}>
        {label ? (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required ? <span className={styles.requiredMark}> *</span> : null}
          </label>
        ) : null}
        <div className={styles.selectWrapper}>
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              styles.select,
              error && styles.selectError,
              showsPlaceholderRow && styles.selectPlaceholder,
            )}
            {...rest}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden>
            ▾
          </span>
        </div>
        {error ? (
          <p id={`${selectId}-error`} role="alert" className={styles.error}>
            {error}
          </p>
        ) : hint ? (
          <p id={`${selectId}-hint`} className={styles.hint}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
