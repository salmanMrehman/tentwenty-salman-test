import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages <= 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("highlights the active page via aria-current", () => {
    render(<Pagination page={3} totalPages={10} onChange={() => {}} />);
    const active = screen.getByRole("button", { name: "3" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("calls onChange with the next page when clicking a number", async () => {
    const onChange = jest.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("disables Previous on first page and Next on last", () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={5} onChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();

    rerender(<Pagination page={5} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
