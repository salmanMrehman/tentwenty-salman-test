import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles when clicked", async () => {
    const onChange = jest.fn();
    render(<Checkbox label="Remember me" onChange={onChange} />);
    const cb = screen.getByLabelText("Remember me");
    await userEvent.click(cb);
    expect(onChange).toHaveBeenCalled();
    expect((cb as HTMLInputElement).checked).toBe(true);
  });
});
