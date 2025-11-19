"use client";

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-slate-100" />
        <p className="text-sm text-slate-300">Loading...</p>
      </div>
    </div>
  );
}
