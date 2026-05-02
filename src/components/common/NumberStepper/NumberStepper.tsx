import { useId } from "react";
import { cn } from "@helpers/classNames";
import styles from "./NumberStepper.module.css";

export interface NumberStepperProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

/**
 * Numeric input with `−` and `+` buttons (hours field in the entry
 * modal). Keeps the value clamped to `[min, max]`.
 */
export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  required,
  error,
  className,
  id,
}: NumberStepperProps) {
  const reactId = useId();
  const inputId = id ?? `stepper-${reactId}`;

  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const setVal = (v: number) => onChange(clamp(v));

  return (
    <div className={cn(styles.field, className)}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? <span className={styles.requiredMark}> *</span> : null}
        </label>
      ) : null}
      <div className={cn(styles.group, error && styles.groupError)}>
        <button
          type="button"
          aria-label="Decrease"
          className={styles.btn}
          onClick={() => setVal(value - step)}
          disabled={value <= min}
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            setVal(next);
          }}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          className={styles.input}
        />
        <button
          type="button"
          aria-label="Increase"
          className={styles.btn}
          onClick={() => setVal(value + step)}
          disabled={value >= max}
        >
          +
        </button>
      </div>
      {error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
