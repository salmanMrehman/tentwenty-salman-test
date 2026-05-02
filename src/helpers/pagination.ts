/**
 * Builds the page list to render in the pagination control.
 *
 * Result is an array of either page numbers or the literal "..." string,
 * matching the design (e.g. `Previous 1 2 3 4 5 6 7 8 ... 99 Next`).
 */
export function buildPageList(
  currentPage: number,
  totalPages: number,
  /** How many "always-visible" pages to show on the left edge. */
  edgeWindow = 8,
): Array<number | "..."> {
  if (totalPages <= 0) return [];

  // Small case: show every page, no ellipsis needed.
  if (totalPages <= edgeWindow + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | "..."> = [];

  // If the cursor sits inside the left "window", render the window
  // followed by an ellipsis and the last page.
  if (currentPage <= edgeWindow) {
    for (let i = 1; i <= edgeWindow; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  // If the cursor sits near the end, render first page + ellipsis + tail.
  if (currentPage >= totalPages - edgeWindow + 1) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - edgeWindow + 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Otherwise: 1 ... (current-1) current (current+1) ... last
  pages.push(1);
  pages.push("...");
  pages.push(currentPage - 1);
  pages.push(currentPage);
  pages.push(currentPage + 1);
  pages.push("...");
  pages.push(totalPages);
  return pages;
}
