import { APP_STRINGS } from "@constants/strings";
import { cn } from "@helpers/classNames";
import styles from "./AddTaskRow.module.css";

export interface AddTaskRowProps {
  onClick: () => void;
  /** When true, shows the "active" hover treatment (matches design). */
  emphasised?: boolean;
}

/**
 * Dashed "+ Add new task" row used inside each day group.
 */
export function AddTaskRow({ onClick, emphasised }: AddTaskRowProps) {
  return (
    <button
      type="button"
      className={cn(styles.row, emphasised && styles.emphasised)}
      onClick={onClick}
    >
      {APP_STRINGS.weekDetail.addNewTask}
    </button>
  );
}
