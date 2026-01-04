"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent h-16" />
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-white/70 dark:bg-[#0B0E14]/70 backdrop-blur-xl border-slate-200 dark:border-white/5 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              CodeArena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {["Features", "Problems", "How It Works", "Testimonials"].map(
              (item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  {item}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? (
                // Sun Icon (Solar Style)
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                // Moon Icon
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </Button>

            {!isMounted ? (
              // Loading state or default unauthenticated state to prevent hydration mismatch
              <div className="w-24 h-10" />
            ) : isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-transparent"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  onClick={() => logout()}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-transparent"
                >
                  <Link href="/login">Sign In</Link>
                </Button>

                <Button
                  asChild
                  className="bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] hover:bg-blue-600 dark:hover:bg-blue-50 shadow-lg shadow-blue-500/10 rounded-full px-6 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                className="w-6 h-6 text-slate-700 dark:text-slate-200"
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
