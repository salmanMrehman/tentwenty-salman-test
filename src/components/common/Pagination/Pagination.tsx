import { buildPageList } from "@helpers/pagination";
import { cn } from "@helpers/classNames";
import { APP_STRINGS } from "@constants/strings";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * Numbered pagination matching the design pill (Previous, page list with
 * ellipsis, Next).
 */
export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageList = buildPageList(page, totalPages);
  const goTo = (target: number) => {
    if (target < 1 || target > totalPages || target === page) return;
    onChange(target);
  };

  return (
    <nav
      className={cn(styles.pagination, className)}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        type="button"
        className={cn(styles.button, styles.edgeButton)}
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
      >
        {APP_STRINGS.pagination.previous}
      </button>

      <ul className={styles.list}>
        {pageList.map((item, idx) => {
          if (item === "...") {
            return (
              <li key={`ellipsis-${idx}`} className={styles.ellipsis}>
                {APP_STRINGS.pagination.ellipsis}
              </li>
            );
          }
          const isActive = item === page;
          return (
            <li key={item}>
              <button
                type="button"
                className={cn(styles.button, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={cn(styles.button, styles.edgeButton)}
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
      >
        {APP_STRINGS.pagination.next}
      </button>
    </nav>
  );
}
