import { ChangeEvent } from "react";
import { Select } from "@components/common/Select/Select";
import { Input } from "@components/common/Input/Input";
import { APP_STRINGS } from "@constants/strings";
import { STATUS_FILTER_OPTIONS } from "@constants/timesheet";
import { TimesheetFilters as Filters } from "@types-app/timesheet.types";
import { TimesheetStatus } from "@types-app/timesheet.types";
import styles from "./TimesheetFilters.module.css";

export interface TimesheetFiltersProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}

/**
 * Filters bar for the dashboard table.
 *
 * Two date inputs (start/end) and a status select. We use native date
 * inputs for simplicity and accessibility - good enough for the demo
 * and zero extra deps.
 */
export function TimesheetFiltersBar({
  filters,
  onChange,
}: TimesheetFiltersProps) {
  const handleStart = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ startDate: e.target.value || undefined });
  };
  const handleEnd = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ endDate: e.target.value || undefined });
  };
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ status: e.target.value as TimesheetStatus | "all" });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.dateGroup}>
        <Input
          label={`${APP_STRINGS.dashboard.filterDateRange} (from)`}
          type="date"
          value={filters.startDate ?? ""}
          onChange={handleStart}
        />
        <Input
          label={`${APP_STRINGS.dashboard.filterDateRange} (to)`}
          type="date"
          value={filters.endDate ?? ""}
          onChange={handleEnd}
        />
      </div>
      <Select
        label={APP_STRINGS.dashboard.filterStatus}
        value={filters.status ?? "all"}
        onChange={handleStatus}
        options={STATUS_FILTER_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
      />
    </div>
  );
}
