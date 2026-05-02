import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntryRow } from "./EntryRow";
import { TimesheetEntry, WorkType } from "@types-app/timesheet.types";

const ENTRY: TimesheetEntry = {
  id: "e-1",
  weekId: "week-1",
  date: "2024-01-21",
  projectId: "p-1",
  projectName: "Homepage Development",
  workType: WorkType.Feature,
  description: "Build hero section",
  hours: 4,
};

describe("EntryRow", () => {
  it("renders description, hours, and project name", () => {
    render(<EntryRow entry={ENTRY} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Build hero section")).toBeInTheDocument();
    expect(screen.getByText("4 hrs")).toBeInTheDocument();
    expect(screen.getByText("Homepage Development")).toBeInTheDocument();
  });

  it("calls onEdit / onDelete from the kebab menu", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<EntryRow entry={ENTRY} onEdit={onEdit} onDelete={onDelete} />);
    await userEvent.click(screen.getByLabelText(/entry actions/i));
    await userEvent.click(screen.getByRole("menuitem", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(ENTRY);

    await userEvent.click(screen.getByLabelText(/entry actions/i));
    await userEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(ENTRY);
  });
});
