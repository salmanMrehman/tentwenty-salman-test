import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with a label and hint", () => {
    render(<Input label="Email" hint="We never share it" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("We never share it")).toBeInTheDocument();
  });

  it("shows an error message and hides the hint when invalid", () => {
    render(
      <Input
        label="Email"
        hint="We never share it"
        error="Email is required"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards typing to the underlying input", async () => {
    const handleChange = jest.fn();
    render(<Input label="Email" onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText("Email"), "abc");
    expect(handleChange).toHaveBeenCalled();
  });
});
