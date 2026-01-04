// src/features/auth/api/me.ts
import { authClient } from "@/lib/http";
import { MeResponse } from "../types";

export async function getMe(): Promise<MeResponse> {
  const response = await authClient.get<MeResponse>("/me");
  return {
    ...response.data,
    role: response.data.role || "USER",
  };
}
