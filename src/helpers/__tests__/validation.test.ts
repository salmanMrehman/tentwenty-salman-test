import { WorkType } from "@types-app/timesheet.types";
import { validateEntry, validateLogin } from "../validation";

describe("validateLogin", () => {
  it("requires email and password", () => {
    const e = validateLogin("", "");
    expect(e.email).toBeTruthy();
    expect(e.password).toBeTruthy();
  });

  it("rejects malformed emails", () => {
    const e = validateLogin("not-an-email", "password123");
    expect(e.email).toMatch(/valid email/i);
    expect(e.password).toBeUndefined();
  });

  it("rejects short passwords", () => {
    const e = validateLogin("user@example.com", "abc");
    expect(e.password).toMatch(/at least 6/i);
    expect(e.email).toBeUndefined();
  });

  it("returns no errors for valid input", () => {
    expect(validateLogin("user@example.com", "password123")).toEqual({});
  });
});

describe("validateEntry", () => {
  const baseValid = {
    projectId: "p-1",
    workType: WorkType.Feature,
    description: "Build the hero",
    hours: 4,
    date: "2024-01-21",
  };

  it("accepts a fully valid entry within the weekly cap", () => {
    expect(
      validateEntry(baseValid, { loggedHoursExcludingThis: 0 }),
    ).toEqual({});
  });

  it("requires every field", () => {
    const e = validateEntry({}, { loggedHoursExcludingThis: 0 });
    expect(e.projectId).toBeTruthy();
    expect(e.workType).toBeTruthy();
    expect(e.description).toBeTruthy();
    expect(e.hours).toBeTruthy();
  });

  it("rejects hours under min", () => {
    const e = validateEntry({ ...baseValid, hours: 0 }, {
      loggedHoursExcludingThis: 0,
    });
    expect(e.hours).toBeTruthy();
  });

  it("rejects hours over per-entry cap", () => {
    const e = validateEntry({ ...baseValid, hours: 30 }, {
      loggedHoursExcludingThis: 0,
    });
    expect(e.hours).toMatch(/exceed 24/i);
  });

  it("respects the weekly 40-hour cap", () => {
    const e = validateEntry({ ...baseValid, hours: 5 }, {
      loggedHoursExcludingThis: 38,
    });
    expect(e.hours).toMatch(/2 more hours/i);
  });
});
