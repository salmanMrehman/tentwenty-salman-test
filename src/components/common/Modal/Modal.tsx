import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@helpers/classNames";
import styles from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Optional fixed footer slot (Save/Cancel buttons). */
  footer?: ReactNode;
  /** Width of the modal. */
  size?: "sm" | "md" | "lg";
  /** Hide the close (X) button in the header. */
  hideCloseButton?: boolean;
}

/** DOM id for the portal container — lives inside `<main>` in `_app.tsx`. */
export const MODAL_ROOT_ID = "modal-root";

/**
 * Accessible modal/dialog.
 *
 * Implementation notes:
 *  - Portals into `#modal-root` inside `<main>` so typography matches the rest
 *    of the app (Inter / Tailwind `font-sans`). Falls back to `document.body`
 *    if the mount node is missing (e.g. isolated tests).
 *  - Closes on backdrop click and Escape key.
 *  - Locks body scroll while open.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  hideCloseButton,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Escape-to-close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus the dialog on open so screen readers announce it.
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const mount =
    document.getElementById(MODAL_ROOT_ID) ?? document.body;

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(styles.dialog, styles[size])}
      >
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          {hideCloseButton ? null : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={styles.closeBtn}
            >
              ×
            </button>
          )}
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    mount,
  );
}
