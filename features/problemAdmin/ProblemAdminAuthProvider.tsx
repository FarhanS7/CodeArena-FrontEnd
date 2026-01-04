"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ProblemAdminAuthContextValue {
  username: string | null;
  basicAuthHeader: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const ProblemAdminAuthContext = createContext<
  ProblemAdminAuthContextValue | undefined
>(undefined);

const STORAGE_KEY = "problemAdminBasicAuth";

interface StoredAuth {
  username: string;
  basicAuthHeader: string;
}

export const ProblemAdminAuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [basicAuthHeader, setBasicAuthHeader] = useState<string | null>(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredAuth = JSON.parse(stored);
      setUsername(parsed.username);
      setBasicAuthHeader(parsed.basicAuthHeader);
    }
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (username && basicAuthHeader) {
      const payload: StoredAuth = { username, basicAuthHeader };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [username, basicAuthHeader]);

  const login = (usernameInput: string, password: string) => {
    const header = "Basic " + btoa(`${usernameInput}:${password}`);
    setUsername(usernameInput);
    setBasicAuthHeader(header);
  };

  const logout = () => {
    setUsername(null);
    setBasicAuthHeader(null);
  };

  const value: ProblemAdminAuthContextValue = {
    username,
    basicAuthHeader,
    isLoggedIn: !!basicAuthHeader,
    login,
    logout,
  };

  return (
    <ProblemAdminAuthContext.Provider value={value}>
      {children}
    </ProblemAdminAuthContext.Provider>
  );
};

export function useProblemAdminAuth(): ProblemAdminAuthContextValue {
  const ctx = useContext(ProblemAdminAuthContext);
  if (!ctx) {
    throw new Error(
      "useProblemAdminAuth must be used within a ProblemAdminAuthProvider"
    );
  }
  return ctx;
}
