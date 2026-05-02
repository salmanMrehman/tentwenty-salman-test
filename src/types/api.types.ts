/**
 * Generic API response envelopes used across all internal `/api/*` routes.
 *
 * Keeping this consistent gives the client predictable error handling.
 */

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    /** Optional field-level messages, useful for form validation. */
    fields?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
