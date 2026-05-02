import { AuthUser } from "@types-app/auth.types";

/**
 * Hard-coded users for dummy authentication.
 *
 * In a real app, passwords would never be stored like this. This is for
 * demo purposes only.
 */
interface MockUserRecord extends AuthUser {
  password: string;
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "u-1",
    name: "John Doe",
    email: "john@tentwenty.com",
    password: "password123",
  },
  {
    id: "u-2",
    name: "Salman M.",
    email: "salman@tentwenty.com",
    password: "password123",
  },
];

/**
 * The single default credential we surface in the README and pre-fill
 * UX hints. Keeping it in one place avoids drift.
 */
export const DEFAULT_DEMO_CREDENTIALS = {
  email: MOCK_USERS[0].email,
  password: MOCK_USERS[0].password,
};
