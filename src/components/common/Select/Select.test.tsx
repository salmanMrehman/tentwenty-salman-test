import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
];

describe("Select", () => {
  it("renders all options under the label", () => {
    render(<Select label="Letter" options={OPTIONS} />);
    expect(screen.getByLabelText("Letter")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bravo" })).toBeInTheDocument();
  });

  it("calls onChange when the user picks an option", async () => {
    const onChange = jest.fn();
    render(
      <Select
        label="Letter"
        options={OPTIONS}
        onChange={onChange}
        defaultValue="a"
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText("Letter"), "b");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows an error and marks the control invalid", () => {
    render(<Select label="Letter" options={OPTIONS} error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByLabelText("Letter")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
