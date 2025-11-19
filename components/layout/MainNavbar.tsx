// "use client";

// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/features/auth/AuthProvider";
// import Link from "next/link";

// export function MainNavbar() {
//   const { user, logout, isLoading } = useAuth();

//   return (
//     <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
//       <nav className="container mx-auto flex h-14 items-center justify-between px-4">
//         <Link href="/dashboard" className="flex items-center gap-2">
//           <span className="text-lg font-semibold tracking-tight">
//             Code Arena
//           </span>
//         </Link>

//         {user && (
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-slate-300 text-right">
//               <div className="font-medium text-slate-100">
//                 {user.username}{" "}
//                 <span className="text-xs text-slate-400">({user.role})</span>
//               </div>
//               <div className="text-xs text-slate-400">{user.email}</div>
//             </div>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={logout}
//               disabled={isLoading}
//               className="border-slate-700 text-slate-100 hover:bg-slate-800"
//             >
//               {isLoading ? "Logging out..." : "Logout"}
//             </Button>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              CodeArena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#problems"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Problems
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Testimonials
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? "☀️" : "🌙"}
            </Button>

            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            >
              <Link href="/signup">Get Started</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
