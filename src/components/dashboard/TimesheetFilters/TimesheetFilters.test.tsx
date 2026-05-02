import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimesheetFiltersBar } from "./TimesheetFilters";

describe("TimesheetFiltersBar", () => {
  it("emits a status change", async () => {
    const onChange = jest.fn();
    render(
      <TimesheetFiltersBar
        filters={{ status: "all" }}
        onChange={onChange}
      />,
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/status/i),
      "completed",
    );
    expect(onChange).toHaveBeenCalledWith({ status: "completed" });
  });

  it("emits a start date change", async () => {
    const onChange = jest.fn();
    render(
      <TimesheetFiltersBar
        filters={{ status: "all" }}
        onChange={onChange}
      />,
    );
    const start = screen.getByLabelText(/from/i);
    await userEvent.type(start, "2024-01-01");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ startDate: "2024-01-01" }),
    );
  });
});
