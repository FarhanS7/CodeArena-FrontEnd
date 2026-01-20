// src/components/problems/ProblemListPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchProblems, searchProblems } from "@/features/problems/api";
import type {
    Difficulty,
    Page,
    ProblemSummary,
} from "@/features/problems/types";
import { ChevronLeft, ChevronRight, Info, Loader2, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export function ProblemListPage() {
  const [problemsPage, setProblemsPage] = useState<Page<ProblemSummary> | null>(null);
  const [searchResults, setSearchResults] = useState<ProblemSummary[] | null>(null);
  const [page, setPage] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProblems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // If we have a search query, use the Meilisearch endpoint
      if (debouncedSearch.trim()) {
        const results = await searchProblems(debouncedSearch);
        setSearchResults(results);
        setProblemsPage(null);
      } else {
        // Otherwise use the normal paginated list with difficulty filter
        const data = await fetchProblems({
          page,
          size: 10,
          difficulty: difficulty || undefined,
        });
        setProblemsPage(data);
        setSearchResults(null);
      }
    } catch (err: any) {
      console.error("Failed to load problems", err);
      setError("Failed to load problems. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, difficulty, debouncedSearch]);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const canPrev = page > 0;
  const canNext = problemsPage && page < problemsPage.totalPages - 1;

  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
            <Search className="w-6 h-6 text-blue-500" />
          </div>
          Problem Arena
        </h1>
        <p className="text-slate-400 font-medium">Challenge yourself with curated coding problems.</p>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            <Search className="w-3 h-3" />
            Fast Search
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Start typing to search titles or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-200 placeholder:text-slate-600 rounded-xl transition-all"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            <SlidersHorizontal className="w-3 h-3" />
            Difficulty
          </div>
          <select
            value={difficulty}
            onChange={(e) => {
                setDifficulty(e.target.value as Difficulty | "");
                setPage(0);
            }}
            className="w-full h-12 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Challenges</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium flex items-center gap-3">
             <Info className="w-4 h-4" />
             {error}
          </div>
        )}

        {/* Search Results Label */}
        {isSearching && !isLoading && (
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-500" />
            Found {searchResults?.length || 0} matches in sub-millisecond
          </p>
        )}

        <div className="grid gap-3">
          {isSearching ? (
             searchResults && searchResults.length > 0 ? (
                searchResults.map((p) => <ProblemRow key={p.id} problem={p} />)
             ) : (
                <EmptyState query={debouncedSearch} />
             )
          ) : (
            problemsPage && problemsPage.content.length > 0 ? (
                problemsPage.content.map((p) => <ProblemRow key={p.id} problem={p} />)
            ) : (
                <EmptyState />
            )
          )}
        </div>

        {/* Pagination - Only show when not searching */}
        {!isSearching && problemsPage && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Page {page + 1} of {problemsPage.totalPages || 1}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={!canPrev || isLoading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="text-slate-400 hover:text-white hover:bg-slate-900 gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canNext || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="text-slate-400 hover:text-white hover:bg-slate-900 gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemRow({ problem }: { problem: ProblemSummary }) {
    return (
        <Link
            href={`/problems/${problem.id}`}
            className="group block rounded-2xl border border-slate-800 bg-slate-900/30 px-6 py-5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all active:scale-[0.99]"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-blue-500/20 group-hover:bg-blue-500/10 transition-colors">
                        <span className="text-xs font-black text-slate-500 group-hover:text-blue-400">{problem.id}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                        {problem.title}
                    </h2>
                </div>
                <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        problem.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        problem.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                        {problem.difficulty}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-colors group-hover:translate-x-1 duration-300" />
                </div>
            </div>
        </Link>
    );
}

function EmptyState({ query }: { query?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 rounded-3xl border border-dashed border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No problems found</h3>
            <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
                {query ? `We couldn't find anything matching "${query}".` : "The arena is currently empty."}
            </p>
        </div>
    );
}

function Zap({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    )
}
