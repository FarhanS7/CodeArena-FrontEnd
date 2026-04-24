const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const pickFirst = (...values: Array<string | undefined>) =>
  values.find((value) => value && value.trim().length > 0);

const authBaseFrom = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;

  const normalized = stripTrailingSlash(value);

  if (normalized.endsWith("/auth") || normalized.endsWith("/api/auth")) {
    return normalized;
  }

  if (normalized.endsWith("/api")) {
    return `${normalized}/auth`;
  }

  return `${normalized}/auth`;
};

const API_GATEWAY = pickFirst(
  process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://localhost:20000",
);

const API_GATEWAY_BASE = stripTrailingSlash(API_GATEWAY as string);

export const env = {
  AUTH_BASE_URL: authBaseFrom(
    pickFirst(
      process.env.NEXT_PUBLIC_AUTH_BASE_URL,
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    ),
    `${API_GATEWAY_BASE}/auth`,
  ),
  PROBLEM_BASE_URL: stripTrailingSlash(
    pickFirst(
      process.env.NEXT_PUBLIC_PROBLEM_BASE_URL,
      process.env.NEXT_PUBLIC_PROBLEM_SERVICE_URL,
      `${API_GATEWAY_BASE}`,
    ) as string,
  ),
  AI_BASE_URL: stripTrailingSlash(
    pickFirst(
      process.env.NEXT_PUBLIC_AI_BASE_URL,
      process.env.NEXT_PUBLIC_AI_SERVICE_URL,
      `${API_GATEWAY_BASE}`,
    ) as string,
  ),
  DISCUSSION_BASE_URL: stripTrailingSlash(
    pickFirst(
      process.env.NEXT_PUBLIC_DISCUSSION_BASE_URL,
      process.env.NEXT_PUBLIC_DISCUSSION_SERVICE_URL,
      `${API_GATEWAY_BASE}`,
    ) as string,
  ),
  LEADERBOARD_BASE_URL: stripTrailingSlash(
    pickFirst(
      process.env.NEXT_PUBLIC_LEADERBOARD_BASE_URL,
      process.env.NEXT_PUBLIC_LEADERBOARD_SERVICE_URL,
      `${API_GATEWAY_BASE}`,
    ) as string,
  ),
};
