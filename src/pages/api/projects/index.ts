import type { NextApiRequest, NextApiResponse } from "next";
import { fail, ok, withAuth } from "@helpers/apiHandler";
import { MOCK_PROJECTS } from "@mocks/projects";
import { ApiResponse } from "@types-app/api.types";
import { Project } from "@types-app/timesheet.types";

/**
 * GET /api/projects
 *
 * Returns all available projects, used to populate the entry modal's
 * Project select.
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Project[]>>,
) {
  if (req.method !== "GET") {
    fail(res, 405, "METHOD_NOT_ALLOWED", `Method ${req.method} not allowed`);
    return;
  }
  ok(res, MOCK_PROJECTS);
}

export default withAuth(handler);
