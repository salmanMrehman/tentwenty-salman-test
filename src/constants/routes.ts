/**
 * Centralised route map. Components should never construct paths inline;
 * always reference `ROUTES.*`.
 */

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  timesheetWeek: (weekId: string) => `/dashboard/${weekId}`,
} as const;

export const API_ROUTES = {
  timesheets: "/api/timesheets",
  timesheetById: (id: string) => `/api/timesheets/${id}`,
  entries: "/api/entries",
  entryById: (id: string) => `/api/entries/${id}`,
  projects: "/api/projects",
} as const;
