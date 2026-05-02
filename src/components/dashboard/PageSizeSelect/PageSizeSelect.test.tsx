import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageSizeSelect } from "./PageSizeSelect";

describe("PageSizeSelect", () => {
  it("calls onChange with a number", async () => {
    const onChange = jest.fn();
    render(<PageSizeSelect value={5} onChange={onChange} />);
    await userEvent.selectOptions(
      screen.getByLabelText(/rows per page/i),
      "10",
    );
    expect(onChange).toHaveBeenCalledWith(10);
  });
});
