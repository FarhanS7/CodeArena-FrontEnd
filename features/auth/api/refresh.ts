// src/features/auth/api/refresh.ts
import { authClient } from "@/lib/http";

export async function refreshToken(): Promise<void> {
  await authClient.post("/refresh", {});
}
