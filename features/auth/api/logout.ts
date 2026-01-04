// src/features/auth/api/logout.ts
import { authClient } from "@/lib/http";

export async function logout(): Promise<void> {
  await authClient.post("/logout");
}
