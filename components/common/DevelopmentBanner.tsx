"use client";

import { Info } from "lucide-react";

export function DevelopmentBanner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2 px-4 shadow-md overflow-hidden">
      {/* Subtle animated background shine */}
      <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span className="tracking-tight">
          The website is <span className="font-bold">under development</span>. Some features might be incomplete.
        </span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          50% { transform: translateX(100%) skewX(-12deg); }
          100% { transform: translateX(100%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
}
