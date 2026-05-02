import { useEffect, useRef, useState } from "react";
import { TimesheetEntry } from "@types-app/timesheet.types";
import { APP_STRINGS } from "@constants/strings";
import { cn } from "@helpers/classNames";
import styles from "./EntryRow.module.css";

export interface EntryRowProps {
  entry: TimesheetEntry;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

/**
 * Single timesheet entry row (description + hours + project tag + menu).
 *
 * The kebab menu is intentionally lightweight: a button toggling a
 * popover that closes on outside-click or selection.
 */
export function EntryRow({ entry, onEdit, onDelete }: EntryRowProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={styles.row}>
      <div className={styles.description}>{entry.description}</div>
      <div className={styles.meta}>
        <span className={styles.hours}>
          {APP_STRINGS.weekDetail.hoursSuffix(entry.hours)}
        </span>
        <span className={styles.tag}>{entry.projectName}</span>
        <div className={styles.menuWrap} ref={wrapperRef}>
          <button
            type="button"
            aria-label="Entry actions"
            aria-haspopup="menu"
            aria-expanded={open}
            className={styles.menuButton}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>⋯</span>
          </button>
          {open ? (
            <div role="menu" className={styles.menu}>
              <button
                role="menuitem"
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  setOpen(false);
                  onEdit(entry);
                }}
              >
                {APP_STRINGS.weekDetail.edit}
              </button>
              <button
                role="menuitem"
                type="button"
                className={cn(styles.menuItem, styles.menuItemDanger)}
                onClick={() => {
                  setOpen(false);
                  onDelete(entry);
                }}
              >
                {APP_STRINGS.weekDetail.delete}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
