export const env = {
  AUTH_BASE_URL:
    process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:3100/auth",
  PROBLEM_BASE_URL:
    process.env.NEXT_PUBLIC_PROBLEM_BASE_URL ?? "http://localhost:8080",
};
