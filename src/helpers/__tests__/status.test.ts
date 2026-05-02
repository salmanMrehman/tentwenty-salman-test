import { TimesheetStatus } from "@types-app/timesheet.types";
import { deriveStatusFromHours, sumEntryHours } from "../status";

describe("status helpers", () => {
  describe("deriveStatusFromHours", () => {
    it("returns missing when zero", () => {
      expect(deriveStatusFromHours(0)).toBe(TimesheetStatus.Missing);
    });

    it("returns incomplete for partial hours", () => {
      expect(deriveStatusFromHours(20)).toBe(TimesheetStatus.Incomplete);
      expect(deriveStatusFromHours(39.99)).toBe(TimesheetStatus.Incomplete);
    });

    it("returns completed at the 40-hour target", () => {
      expect(deriveStatusFromHours(40)).toBe(TimesheetStatus.Completed);
      expect(deriveStatusFromHours(45)).toBe(TimesheetStatus.Completed);
    });
  });

  describe("sumEntryHours", () => {
    it("adds positive numbers", () => {
      expect(sumEntryHours([{ hours: 1 }, { hours: 2.5 }])).toBe(3.5);
    });

    it("ignores invalid entries", () => {
      expect(
        sumEntryHours([
          { hours: 1 },
          { hours: NaN as unknown as number },
          { hours: 2 },
        ]),
      ).toBe(3);
    });
  });
});
