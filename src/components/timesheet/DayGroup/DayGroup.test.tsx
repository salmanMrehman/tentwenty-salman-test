import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DayGroup } from "./DayGroup";
import { TimesheetEntry, WorkType } from "@types-app/timesheet.types";

const ENTRY: TimesheetEntry = {
  id: "e-1",
  weekId: "week-1",
  date: "2024-01-21",
  projectId: "p-1",
  projectName: "Homepage Development",
  workType: WorkType.Feature,
  description: "Build hero",
  hours: 4,
};

describe("DayGroup", () => {
  it("renders the date label", () => {
    render(
      <DayGroup
        date="2024-01-21"
        entries={[ENTRY]}
        onAddEntry={() => {}}
        onEditEntry={() => {}}
        onDeleteEntry={() => {}}
      />,
    );
    expect(screen.getByText("Jan 21")).toBeInTheDocument();
  });

  it("calls onAddEntry with this group's date", async () => {
    const onAdd = jest.fn();
    render(
      <DayGroup
        date="2024-01-21"
        entries={[]}
        onAddEntry={onAdd}
        onEditEntry={() => {}}
        onDeleteEntry={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /add new task/i }),
    );
    expect(onAdd).toHaveBeenCalledWith("2024-01-21");
  });
});
