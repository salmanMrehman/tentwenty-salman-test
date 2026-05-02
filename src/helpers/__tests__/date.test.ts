import {
  doesWeekOverlapRange,
  formatShortDate,
  formatWeekRange,
  isDateInRange,
  parseIsoDate,
  toIsoDate,
} from "../date";

describe("date helpers", () => {
  describe("formatShortDate", () => {
    it("returns 'Jan 21' for 2024-01-21", () => {
      expect(formatShortDate("2024-01-21")).toBe("Jan 21");
    });
  });

  describe("formatWeekRange", () => {
    it("formats a same-month range", () => {
      expect(formatWeekRange("2024-01-01", "2024-01-05")).toBe(
        "1 - 5 January, 2024",
      );
    });

    it("formats a cross-month range", () => {
      expect(formatWeekRange("2024-01-29", "2024-02-02")).toBe(
        "29 January - 2 February, 2024",
      );
    });

    it("formats a cross-year range", () => {
      expect(formatWeekRange("2023-12-30", "2024-01-05")).toBe(
        "30 December, 2023 - 5 January, 2024",
      );
    });
  });

  describe("parseIsoDate / toIsoDate", () => {
    it("round-trips an ISO date string", () => {
      const d = parseIsoDate("2024-03-15");
      expect(toIsoDate(d)).toBe("2024-03-15");
    });
  });

  describe("isDateInRange", () => {
    it("includes the boundaries", () => {
      expect(isDateInRange("2024-01-01", "2024-01-01", "2024-01-31")).toBe(true);
      expect(isDateInRange("2024-01-31", "2024-01-01", "2024-01-31")).toBe(true);
    });

    it("excludes dates outside the range", () => {
      expect(isDateInRange("2023-12-31", "2024-01-01", "2024-01-31")).toBe(false);
      expect(isDateInRange("2024-02-01", "2024-01-01", "2024-01-31")).toBe(false);
    });
  });

  describe("doesWeekOverlapRange", () => {
    it("returns true when the week sits inside the range", () => {
      expect(
        doesWeekOverlapRange("2024-01-01", "2024-01-05", "2023-12-30", "2024-01-31"),
      ).toBe(true);
    });

    it("returns true when the week partially overlaps the start", () => {
      expect(
        doesWeekOverlapRange("2024-01-01", "2024-01-05", "2024-01-04", "2024-02-15"),
      ).toBe(true);
    });

    it("returns false when the week is fully before the range", () => {
      expect(
        doesWeekOverlapRange("2024-01-01", "2024-01-05", "2024-02-01", "2024-02-15"),
      ).toBe(false);
    });

    it("returns true when no range is given", () => {
      expect(doesWeekOverlapRange("2024-01-01", "2024-01-05")).toBe(true);
    });
  });
});
