// src/features/auth/types.ts

export type UserRole = "USER" | "ADMIN"; // extend if needed

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface MeResponse extends AuthUser {}
