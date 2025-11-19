"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/AuthProvider";

export function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <Card className="p-4 bg-slate-900 border-slate-800">
        <h2 className="text-xl font-medium mb-2">
          Welcome, {user.username} 👋
        </h2>
        <p className="text-sm text-slate-300">
          This is your minimal dashboard. Once the rest of the backend is done,
          we&apos;ll expand this with problems, submissions, and more.
        </p>
      </Card>

      <Card className="p-4 bg-slate-900 border-slate-800">
        <h3 className="text-lg font-semibold mb-2">Your Account</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>
            <span className="font-medium text-slate-100">Email:</span>{" "}
            {user.email}
          </li>
          <li>
            <span className="font-medium text-slate-100">Username:</span>{" "}
            {user.username}
          </li>
          <li>
            <span className="font-medium text-slate-100">Role:</span>{" "}
            {user.role}
          </li>
          <li>
            <span className="font-medium text-slate-100">User ID:</span>{" "}
            {user.id}
          </li>
        </ul>
      </Card>
    </div>
  );
}
