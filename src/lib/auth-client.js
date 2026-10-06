import { createAuthClient } from "better-auth/react";

const authBaseURL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});