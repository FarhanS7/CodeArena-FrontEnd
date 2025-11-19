"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthProvider";
import { SignupPayload } from "@/features/auth/types";
import { useState } from "react";

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState<SignupPayload>({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof SignupPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(form);
    } catch (err: any) {
      setError("Failed to create user. Maybe email already in use?");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={form.username}
              onChange={handleChange("username")}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
