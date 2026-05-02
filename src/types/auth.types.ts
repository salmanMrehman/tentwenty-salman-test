/**
 * Auth-related types.
 *
 * The shape of our session user is intentionally small: anything that
 * needs the user identity should pull it from `useSession()`.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}
