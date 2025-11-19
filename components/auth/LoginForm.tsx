"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthProvider";
import { LoginPayload } from "@/features/auth/types";
import { useState } from "react";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof LoginPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
    } catch (err: any) {
      // backend likely returns message in response.data.message etc.
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
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
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
