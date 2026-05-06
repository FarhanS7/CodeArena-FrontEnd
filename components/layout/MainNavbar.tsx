"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAutocomplete, useNotifications } from "@/hooks";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Search, Bell, LogOut, User as UserIcon, Award, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function LandingNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { suggestions, isLoading: isSearchLoading } = useAutocomplete(searchQuery);
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

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
      <nav className="sticky top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent h-16" />
    );
  }

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
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

          <div className="hidden lg:flex items-center gap-1">
            {["Problems", "Leaderboard", "Feed"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  {item}
                </Link>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search problems, users..."
                className="pl-10 pr-4 py-2 w-full bg-slate-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-white/10 transition-all rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.length >= 2 && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1F2E] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                  {suggestions.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/problems/${s.id}`}
                      className="flex items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b last:border-none border-slate-100 dark:border-white/5"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">{s.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
              )}
            </Button>

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative rounded-full w-10 h-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Link href="/notifications">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 border-2 border-white dark:border-[#0B0E14] text-[10px] animate-in zoom-in">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

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
                {user.role === "ADMIN" && (
                  <Button
                    variant="ghost"
                    asChild
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-transparent"
                  >
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
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
