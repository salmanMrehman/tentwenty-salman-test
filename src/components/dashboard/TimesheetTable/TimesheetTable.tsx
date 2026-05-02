import Link from "next/link";
import { StatusBadge } from "@components/common/StatusBadge/StatusBadge";
import { APP_STRINGS } from "@constants/strings";
import { ROUTES } from "@constants/routes";
import { STATUS_ACTION_LABELS } from "@constants/timesheet";
import { formatWeekRange } from "@helpers/date";
import { WeeklyTimesheet } from "@types-app/timesheet.types";
import styles from "./TimesheetTable.module.css";

export interface TimesheetTableProps {
  rows: WeeklyTimesheet[];
  isLoading?: boolean;
}

/**
 * Table showing weekly timesheet summaries.
 *
 * Action label changes by status (View/Update/Create) per the design.
 */
export function TimesheetTable({ rows, isLoading }: TimesheetTableProps) {
  if (!isLoading && rows.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{APP_STRINGS.dashboard.noResults}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table} aria-busy={isLoading}>
        <thead>
          <tr>
            <th scope="col" className={styles.weekCol}>
              {APP_STRINGS.dashboard.columnWeek}
            </th>
            <th scope="col" className={styles.dateCol}>
              {APP_STRINGS.dashboard.columnDate}
            </th>
            <th scope="col" className={styles.statusCol}>
              {APP_STRINGS.dashboard.columnStatus}
            </th>
            <th scope="col" className={styles.actionCol}>
              {APP_STRINGS.dashboard.columnActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className={styles.weekCell}>{row.weekNumber}</td>
              <td className={styles.dateCell}>
                {formatWeekRange(row.startDate, row.endDate)}
              </td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td className={styles.actionCell}>
                <Link
                  href={ROUTES.timesheetWeek(row.id)}
                  className={styles.actionLink}
                >
                  {STATUS_ACTION_LABELS[row.status]}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
