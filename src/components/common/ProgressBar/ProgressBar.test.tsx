import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("computes the correct aria-valuenow", () => {
    render(<ProgressBar value={20} max={40} topLabel="20/40 hrs" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "20");
    expect(bar).toHaveAttribute("aria-valuemax", "40");
  });

  it("clamps values exceeding the maximum", () => {
    render(<ProgressBar value={100} max={40} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("renders top and end labels when provided", () => {
    render(<ProgressBar value={20} max={40} topLabel="20/40 hrs" endLabel="50%" />);
    expect(screen.getByText("20/40 hrs")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
