import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders the label and forwards aria attrs on error", () => {
    render(
      <Textarea label="Description" error="Description is required" />,
    );
    expect(screen.getByLabelText("Description")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Description is required",
    );
  });
});
