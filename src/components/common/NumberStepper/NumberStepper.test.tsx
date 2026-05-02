import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { NumberStepper } from "./NumberStepper";

function ControlledStepper(props: {
  initial?: number;
  min?: number;
  max?: number;
}) {
  const [v, setV] = useState(props.initial ?? 5);
  return (
    <NumberStepper
      label="Hours"
      value={v}
      onChange={setV}
      min={props.min}
      max={props.max}
    />
  );
}

describe("NumberStepper", () => {
  it("increments via the + button", async () => {
    render(<ControlledStepper initial={5} />);
    await userEvent.click(screen.getByLabelText("Increase"));
    expect((screen.getByLabelText("Hours") as HTMLInputElement).value).toBe(
      "6",
    );
  });

  it("clamps within min/max", async () => {
    render(<ControlledStepper initial={5} min={0} max={5} />);
    await userEvent.click(screen.getByLabelText("Increase"));
    expect((screen.getByLabelText("Hours") as HTMLInputElement).value).toBe(
      "5",
    );
  });
});
