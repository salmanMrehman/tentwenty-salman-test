import { cn } from "@helpers/classNames";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  /** Current value, will be clamped to [0, max]. */
  value: number;
  /** Maximum value (e.g. 40 for a weekly total). */
  max: number;
  /** Tooltip-style label drawn above the bar (e.g. "20/40 hrs"). */
  topLabel?: string;
  /** Right-aligned label (e.g. "100%"). */
  endLabel?: string;
  className?: string;
}

/**
 * Linear progress bar matching the dashboard design (orange fill, grey
 * track, optional `X/Y hrs` bubble above).
 */
export function ProgressBar({
  value,
  max,
  topLabel,
  endLabel,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={cn(styles.wrapper, className)}>
      {topLabel || endLabel ? (
        <div className={styles.labels}>
          {topLabel ? (
            <span className={styles.topLabel}>{topLabel}</span>
          ) : (
            <span />
          )}
          {endLabel ? <span className={styles.endLabel}>{endLabel}</span> : null}
        </div>
      ) : null}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-label={topLabel ?? `Progress ${pct}%`}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
