import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@helpers/classNames";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

/**
 * Simple labelled checkbox - used for "Remember me" and similar flags.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, className, id, ...rest }, ref) {
    const reactId = useId();
    const inputId = id ?? `checkbox-${reactId}`;
    return (
      <label htmlFor={inputId} className={cn(styles.wrapper, className)}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.input}
          {...rest}
        />
        <span className={styles.label}>{label}</span>
      </label>
    );
  },
);
