import { buildPageList } from "../pagination";

describe("buildPageList", () => {
  it("returns every page when there are few", () => {
    expect(buildPageList(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("matches the design when sitting in the left edge", () => {
    expect(buildPageList(3, 99)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, "...", 99]);
  });

  it("renders 1 ... cur-1 cur cur+1 ... last when in the middle", () => {
    expect(buildPageList(50, 99)).toEqual([1, "...", 49, 50, 51, "...", 99]);
  });

  it("collapses to first + tail when near the end", () => {
    const list = buildPageList(96, 99);
    expect(list[0]).toBe(1);
    expect(list[1]).toBe("...");
    expect(list[list.length - 1]).toBe(99);
  });

  it("returns an empty array for zero pages", () => {
    expect(buildPageList(1, 0)).toEqual([]);
  });
});
