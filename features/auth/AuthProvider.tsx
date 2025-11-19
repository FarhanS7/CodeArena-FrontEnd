"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "./api/login";
import { logout as logoutApi } from "./api/logout";
import { getMe } from "./api/me";
import { refreshToken } from "./api/refresh";
import { signup as signupApi } from "./api/signup";
import type { AuthUser, LoginPayload, SignupPayload } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (error) {
      // Try refresh if unauthorized
      try {
        await refreshToken();
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // Optionally: set up an interval to refresh token every ~10 minutes
    // const interval = setInterval(() => { refreshToken().catch(() => {}); }, 10 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);

  const handleLogin = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { user } = await loginApi(payload);
      setUser(user);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (payload: SignupPayload) => {
    setIsLoading(true);
    try {
      await signupApi(payload);
      // After signup, you can either auto-login or redirect to login page
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    reloadUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
