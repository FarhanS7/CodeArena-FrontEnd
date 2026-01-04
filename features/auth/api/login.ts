// src/features/auth/api/login.ts
import { authClient } from "@/lib/http";
import { LoginPayload, LoginResponse } from "../types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await authClient.post<LoginResponse>("/login", payload);
  return {
    ...response.data,
    user: {
      ...response.data.user,
      role: response.data.user.role || "USER",
    },
  };
}
