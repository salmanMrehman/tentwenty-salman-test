import { ApiResponse } from "@types-app/api.types";

/**
 * Tiny `fetch` wrapper used by the client services.
 *
 * - Always sends/expects JSON.
 * - Always sends cookies (next-auth session cookie).
 * - Throws a `FetchError` on non-2xx; success returns the unwrapped data.
 *
 * Centralising this means components never deal with `Response` directly
 * and we get consistent error semantics across the app.
 */

export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string = "FETCH_ERROR",
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

export async function jsonFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  let body: ApiResponse<T> | undefined;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    // Network or non-JSON error response.
    throw new FetchError(`Unexpected response (HTTP ${res.status})`, res.status);
  }

  if (!res.ok || !body || body.ok === false) {
    const err = body && body.ok === false ? body.error : undefined;
    throw new FetchError(
      err?.message ?? `Request failed with HTTP ${res.status}`,
      res.status,
      err?.code,
      err?.fields,
    );
  }

  return body.data;
}
