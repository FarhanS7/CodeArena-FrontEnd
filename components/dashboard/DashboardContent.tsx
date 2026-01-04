"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/AuthProvider";

export function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-6 pt-24">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400">Overview of your coding journey</p>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-[#0B0E14] p-8 shadow-2xl shadow-blue-900/10">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">👋</span>
            <h2 className="text-2xl font-semibold text-white">
              Welcome back,{" "}
              <span className="text-blue-400">{user.username}</span>
            </h2>
          </div>
          <p className="max-w-2xl text-slate-300 leading-relaxed">
            This is your minimal dashboard. Once the rest of the backend is
            done, we&apos;ll expand this with{" "}
            <span className="text-white font-medium">daily challenges</span>,{" "}
            <span className="text-white font-medium">submission history</span>,
            and{" "}
            <span className="text-white font-medium">
              performance analytics
            </span>
            .
          </p>
        </div>
      </div>

      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="md:col-span-2 bg-[#12141C] border-white/5 p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5 text-blue-400"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <h3 className="font-semibold text-slate-200">
              Profile Information
            </h3>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-y-8 gap-x-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Username
              </label>
              <div className="font-mono text-sm text-slate-200 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                {user.username}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Email Address
              </label>
              <div className="font-mono text-sm text-slate-200 bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {user.email}
              </div>
            </div>

            {/* User ID */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Unique ID
              </label>
              <div className="font-mono text-xs text-slate-400 break-all">
                {user.id}
              </div>
            </div>
          </div>
        </Card>

        {/* Role/Status Card */}
        <Card className="bg-[#12141C] border-white/5 p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-2xl font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Account Role
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {user.role}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
