import {
  TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { cn } from "@helpers/classNames";
import styles from "./Textarea.module.css";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, required, className, id, rows = 4, ...rest },
    ref,
  ) {
    const reactId = useId();
    const textareaId = id ?? `textarea-${reactId}`;
    const describedBy = error
      ? `${textareaId}-error`
      : hint
      ? `${textareaId}-hint`
      : undefined;

    return (
      <div className={cn(styles.field, className)}>
        {label ? (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {required ? <span className={styles.requiredMark}> *</span> : null}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(styles.textarea, error && styles.textareaError)}
          {...rest}
        />
        {error ? (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className={styles.error}
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${textareaId}-hint`} className={styles.hint}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
