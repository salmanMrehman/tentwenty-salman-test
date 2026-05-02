import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntryModal } from "./EntryModal";
import { Project } from "@types-app/timesheet.types";

const PROJECTS: Project[] = [
  { id: "p-1", name: "Homepage Development" },
  { id: "p-2", name: "Mobile App" },
];

describe("EntryModal", () => {
  it("does not render when closed", () => {
    render(
      <EntryModal
        isOpen={false}
        onClose={() => {}}
        editing={null}
        defaultDate="2024-01-21"
        projects={PROJECTS}
        loggedHoursExcludingThis={0}
        onSubmit={() => {}}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const onSubmit = jest.fn();
    render(
      <EntryModal
        isOpen
        onClose={() => {}}
        editing={null}
        defaultDate="2024-01-21"
        projects={PROJECTS}
        loggedHoursExcludingThis={0}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /add entry/i }));
    expect(
      screen.getByText(/please select a project/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/please select a type of work/i)).toBeInTheDocument();
    expect(screen.getByText(/task description is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const onSubmit = jest.fn();
    render(
      <EntryModal
        isOpen
        onClose={() => {}}
        editing={null}
        defaultDate="2024-01-21"
        projects={PROJECTS}
        loggedHoursExcludingThis={0}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/select project/i),
      "p-1",
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/type of work/i),
      "feature",
    );
    await userEvent.type(
      screen.getByLabelText(/task description/i),
      "Build hero section",
    );
    await userEvent.click(screen.getByRole("button", { name: /add entry/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "p-1",
        workType: "feature",
        description: "Build hero section",
      }),
      undefined,
    );
  });

  it("surfaces server-side field errors", () => {
    render(
      <EntryModal
        isOpen
        onClose={() => {}}
        editing={null}
        defaultDate="2024-01-21"
        projects={PROJECTS}
        loggedHoursExcludingThis={0}
        onSubmit={() => {}}
        serverErrors={{ projectId: "Choose a project from the list." }}
      />,
    );
    expect(
      screen.getByText(/choose a project from the list/i),
    ).toBeInTheDocument();
  });
});
