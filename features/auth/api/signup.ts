// src/features/auth/api/signup.ts
import { authClient } from "@/lib/http";
import { SignupPayload } from "../types";

export async function signup(payload: SignupPayload): Promise<void> {
  await authClient.post("/signup", payload);
  // Backend returns only { message: "User created successfully" }
  // We don't need the content here.
}
