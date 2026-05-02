import { ChangeEvent } from "react";
import { Select } from "@components/common/Select/Select";
import { APP_STRINGS } from "@constants/strings";
import { PAGE_SIZE_OPTIONS } from "@constants/timesheet";
import styles from "./PageSizeSelect.module.css";

export interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * "5 per page / 10 per page / ..." control shown beside the pagination.
 */
export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <div className={styles.wrapper}>
      <Select
        aria-label="Rows per page"
        value={String(value)}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(Number(e.target.value))
        }
        options={PAGE_SIZE_OPTIONS.map((n) => ({
          value: String(n),
          label: APP_STRINGS.dashboard.perPage(n),
        }))}
      />
    </div>
  );
}
