import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@helpers/classNames";
import styles from "./Button.module.css";

/**
 * Reusable button.
 *
 * Variants follow the design system rather than colours — pages don't
 * need to know that "primary" is brand-blue today; it just asks for the
 * primary action and gets the right style.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth,
      isLoading,
      className,
      disabled,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isLoading && styles.loading,
          className,
        )}
        {...rest}
      >
        {isLoading ? <span className={styles.spinner} aria-hidden /> : null}
        <span className={cn(isLoading && styles.contentHidden)}>
          {children}
        </span>
      </button>
    );
  },
);
