import clsx, { ClassValue } from "clsx";

/**
 * Tiny re-export of `clsx` under our own name. The indirection means we
 * could swap the impl later (e.g. for `tailwind-merge`) without touching
 * any consumers.
 */
export function cn(...args: ClassValue[]): string {
  return clsx(...args);
}
