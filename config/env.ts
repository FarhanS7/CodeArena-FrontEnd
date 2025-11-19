export const env = {
  // Backend auth service URL
  AUTH_BASE_URL:
    process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:3100/auth",
};
