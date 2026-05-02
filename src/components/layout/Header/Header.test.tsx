import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { Header } from "./Header";

const session = {
  user: { id: "u-1", name: "John Doe", email: "john@tentwenty.com" },
  expires: "2099-01-01T00:00:00Z",
};

describe("Header", () => {
  it("renders the brand wordmark and Timesheets link", () => {
    render(
      <SessionProvider session={session as unknown as never}>
        <Header />
      </SessionProvider>,
    );
    expect(screen.getByText("ticktock")).toBeInTheDocument();
    expect(screen.getByText("Timesheets")).toBeInTheDocument();
  });

  it("shows the signed-in user's name", () => {
    render(
      <SessionProvider session={session as unknown as never}>
        <Header />
      </SessionProvider>,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
