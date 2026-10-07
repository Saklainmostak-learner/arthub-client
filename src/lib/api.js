export const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api/backend"
    : process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000";