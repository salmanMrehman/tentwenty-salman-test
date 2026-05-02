import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ApiError, ApiResponse, ApiSuccess } from "@types-app/api.types";

/**
 * Server-side helpers for our internal API routes.
 *
 * These keep route handlers tiny and consistent:
 *   - One auth check.
 *   - One error envelope.
 *   - One method dispatcher.
 */

export function ok<T>(res: NextApiResponse<ApiResponse<T>>, data: T, status = 200) {
  const body: ApiSuccess<T> = { ok: true, data };
  res.status(status).json(body);
}

/**
 * Sends an error envelope. Uses `NextApiResponse<any>` so callers with
 * typed responses (`NextApiResponse<ApiResponse<MyData>>`) can pass
 * their `res` straight through without juggling generics.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fail(
  res: NextApiResponse<any>,
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
) {
  const body: ApiError = {
    ok: false,
    error: { code, message, ...(fields ? { fields } : {}) },
  };
  res.status(status).json(body);
}

/**
 * Wraps a handler so an unauthenticated request gets a 401 immediately.
 *
 * Usage:
 *   export default withAuth(async (req, res) => { ... });
 */
export function withAuth<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => Promise<void> | void,
) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      fail(res, 401, "UNAUTHORIZED", "You must be signed in.");
      return;
    }
    return handler(req, res);
  };
}
