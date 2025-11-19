"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import { login as loginApi } from "./api/login";
import { logout as logoutApi } from "./api/logout";
import { getMe } from "./api/me";
import { refreshToken } from "./api/refresh";
import { signup as signupApi } from "./api/signup";

import { toast } from "sonner";
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

  /* -------------------------------------------------------
   * Load user on app startup
   * ----------------------------------------------------- */
  const fetchUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (error) {
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
  }, []);

  /* -------------------------------------------------------
   * Auto refresh access token every 10 minutes
   * ----------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Auto refresh failed", error);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [user]);

  /* -------------------------------------------------------
   * LOGIN
   * ----------------------------------------------------- */
  const handleLogin = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { user } = await loginApi(payload);
      setUser(user);

      toast.success("Logged in", {
        description: `Welcome back, ${user.username}!`,
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("LOGIN ERROR >>>", err?.response?.data || err);

      toast.error("Login failed", {
        description: "Invalid credentials or server error.",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------
   * SIGNUP
   * ----------------------------------------------------- */
  const handleSignup = async (payload: SignupPayload) => {
    setIsLoading(true);
    try {
      await signupApi(payload);

      toast.success("Account created", {
        description: "You can now log in with your credentials.",
      });

      router.push("/login");
    } catch (err: any) {
      console.error("SIGNUP ERROR >>>", err?.response?.data || err);

      toast.error("Signup failed", {
        description: "Email may already be in use.",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------
   * LOGOUT
   * ----------------------------------------------------- */
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
      setUser(null);

      toast.success("Logged out", {
        description: "See you again soon.",
      });

      router.push("/login");
    } catch (err: any) {
      console.error("LOGOUT ERROR >>>", err?.response?.data || err);

      toast.error("Logout failed", {
        description: "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------
   * EXPOSE CONTEXT
   * ----------------------------------------------------- */
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

/* -------------------------------------------------------
 * Hook to use Auth anywhere
 * ----------------------------------------------------- */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
