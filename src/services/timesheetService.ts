import { API_ROUTES } from "@constants/routes";
import { jsonFetch } from "@helpers/fetcher";
import {
  EntryFormValues,
  PaginatedTimesheets,
  Project,
  TimesheetEntry,
  TimesheetFilters,
  WeeklyTimesheetDetail,
} from "@types-app/timesheet.types";

/**
 * Single place where the client talks to our internal API routes.
 *
 * Components/hooks should import from here rather than calling `fetch`
 * directly. That keeps URL/query-param construction in one spot and lets
 * us mock the surface in tests easily.
 */

interface ListParams extends TimesheetFilters {
  page: number;
  perPage: number;
}

export async function fetchTimesheets(
  params: ListParams,
): Promise<PaginatedTimesheets> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("perPage", String(params.perPage));
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.status && params.status !== "all") {
    search.set("status", params.status);
  }
  return jsonFetch<PaginatedTimesheets>(
    `${API_ROUTES.timesheets}?${search.toString()}`,
  );
}

export function fetchWeekDetail(id: string): Promise<WeeklyTimesheetDetail> {
  return jsonFetch<WeeklyTimesheetDetail>(API_ROUTES.timesheetById(id));
}

export function fetchProjects(): Promise<Project[]> {
  return jsonFetch<Project[]>(API_ROUTES.projects);
}

export function createEntry(
  weekId: string,
  values: EntryFormValues,
): Promise<TimesheetEntry> {
  return jsonFetch<TimesheetEntry>(API_ROUTES.entries, {
    method: "POST",
    body: JSON.stringify({ weekId, ...values }),
  });
}

export function updateEntry(
  id: string,
  values: Partial<EntryFormValues>,
): Promise<TimesheetEntry> {
  return jsonFetch<TimesheetEntry>(API_ROUTES.entryById(id), {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export function deleteEntry(id: string): Promise<{ id: string }> {
  return jsonFetch<{ id: string }>(API_ROUTES.entryById(id), {
    method: "DELETE",
  });
}
