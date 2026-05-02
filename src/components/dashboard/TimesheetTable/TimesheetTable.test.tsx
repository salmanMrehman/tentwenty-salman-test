import { render, screen } from "@testing-library/react";
import { TimesheetTable } from "./TimesheetTable";
import { TimesheetStatus, WeeklyTimesheet } from "@types-app/timesheet.types";

const ROWS: WeeklyTimesheet[] = [
  {
    id: "week-1",
    weekNumber: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    totalHours: 40,
    status: TimesheetStatus.Completed,
  },
  {
    id: "week-3",
    weekNumber: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    totalHours: 12,
    status: TimesheetStatus.Incomplete,
  },
  {
    id: "week-5",
    weekNumber: 5,
    startDate: "2024-01-29",
    endDate: "2024-02-02",
    totalHours: 0,
    status: TimesheetStatus.Missing,
  },
];

describe("TimesheetTable", () => {
  it("renders one row per timesheet with week numbers", () => {
    render(<TimesheetTable rows={ROWS} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders the correct action label per status", () => {
    render(<TimesheetTable rows={ROWS} />);
    expect(screen.getByRole("link", { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create/i })).toBeInTheDocument();
  });

  it("renders the formatted week range", () => {
    render(<TimesheetTable rows={ROWS} />);
    expect(screen.getByText("1 - 5 January, 2024")).toBeInTheDocument();
    expect(
      screen.getByText("29 January - 2 February, 2024"),
    ).toBeInTheDocument();
  });

  it("renders an empty state when no rows", () => {
    render(<TimesheetTable rows={[]} />);
    expect(
      screen.getByText(/no timesheets match your filters/i),
    ).toBeInTheDocument();
  });
});
