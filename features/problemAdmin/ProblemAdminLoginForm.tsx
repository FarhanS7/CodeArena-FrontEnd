// src/components/problemAdmin/ProblemAdminLoginForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProblemAdminAuth } from "@/features/problemAdmin/ProblemAdminAuthProvider";
import { useState } from "react";

export function ProblemAdminLoginForm() {
  const { login } = useProblemAdminAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminpass");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4 bg-slate-900 border-slate-800">
        <h1 className="text-xl font-semibold text-center">
          Problem Service Admin Login
        </h1>
        <p className="text-xs text-slate-400 text-center">
          This login is for the Problem Service (Basic Auth).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-100">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-950 border-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-100">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-700"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login as Problem Admin
          </Button>
        </form>
      </Card>
    </div>
  );
}
