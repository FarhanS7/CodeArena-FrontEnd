// src/components/problems/ProblemListPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchProblems } from "@/features/problems/api";
import type {
  Difficulty,
  Page,
  ProblemSummary,
} from "@/features/problems/types";
import Link from "next/link";
import { useEffect, useState } from "react";

// If you did NOT install shadcn Select, replace this with a plain <select> implementation.

const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export function ProblemListPage() {
  const [problemsPage, setProblemsPage] = useState<Page<ProblemSummary> | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProblems({
        page,
        size: 10,
        difficulty: difficulty || undefined,
        search: search || undefined,
      });
      setProblemsPage(data);
    } catch (err: any) {
      console.error("Failed to fetch problems", err);
      setError("Failed to load problems.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchApply = () => {
    setPage(0);
    loadProblems();
  };

  const canPrev = page > 0;
  const canNext = problemsPage && page < problemsPage.totalPages - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Problems</h1>
      </div>

      <Card className="p-4 bg-slate-900 border-slate-800 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px] space-y-1">
            <label className="text-sm font-medium text-slate-100">Search</label>
            <Input
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border-slate-700"
            />
          </div>

          <div className="w-40 space-y-1">
            <label className="text-sm font-medium text-slate-100">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">All</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSearchApply} disabled={isLoading}>
            {isLoading ? "Loading..." : "Apply"}
          </Button>
        </div>

        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </Card>

      <Card className="p-4 bg-slate-900 border-slate-800 space-y-4">
        {isLoading && !problemsPage ? (
          <p className="text-sm text-slate-300">Loading problems...</p>
        ) : problemsPage && problemsPage.content.length > 0 ? (
          <div className="space-y-2">
            {problemsPage.content.map((p) => (
              <Link
                key={p.id}
                href={`/problems/${p.id}`}
                className="block rounded-md border border-slate-800 bg-slate-950 px-4 py-3 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-100">
                    {p.id}. {p.title}
                  </h2>
                  <span className="text-xs font-semibold rounded-full px-2 py-1 bg-slate-800 text-slate-100">
                    {p.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">No problems found.</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            Page {page + 1} / {problemsPage ? problemsPage.totalPages || 1 : 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev || isLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
