import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";
import { TimesheetStatus } from "@types-app/timesheet.types";
import { STATUS_LABELS } from "@constants/timesheet";

describe("StatusBadge", () => {
  it.each([
    TimesheetStatus.Completed,
    TimesheetStatus.Incomplete,
    TimesheetStatus.Missing,
  ])("renders the %s label", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(STATUS_LABELS[status])).toBeInTheDocument();
  });
});
