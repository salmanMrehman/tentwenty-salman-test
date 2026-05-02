import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTaskRow } from "./AddTaskRow";

describe("AddTaskRow", () => {
  it("renders the label and triggers onClick", async () => {
    const onClick = jest.fn();
    render(<AddTaskRow onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: /add new task/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
