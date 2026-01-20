export const env = {
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001/api",
  PROBLEM_BASE_URL: process.env.NEXT_PUBLIC_PROBLEM_SERVICE_URL || "http://localhost:8080/api",
  AI_BASE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:3004/api",
};
