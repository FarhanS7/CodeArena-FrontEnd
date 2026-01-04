// src/components/problemAdmin/AdminProblemListPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProblemAdminAuth } from "@/features/problemAdmin/ProblemAdminAuthProvider";
import { ProblemAdminLoginForm } from "@/features/problemAdmin/ProblemAdminLoginForm";
import { deleteProblem, fetchProblems } from "@/features/problems/api";
import type { Page, ProblemSummary } from "@/features/problems/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { ProblemAdminLoginForm } from "./ProblemAdminLoginForm";

export function AdminProblemListPage() {
  const { isLoggedIn, basicAuthHeader, logout, username } =
    useProblemAdminAuth();
  const [page, setPage] = useState(0);
  const [problemsPage, setProblemsPage] = useState<Page<ProblemSummary> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadProblems = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await fetchProblems({ page, size: 20 });
      setProblemsPage(data);
    } catch (err) {
      console.error("Failed to fetch problems for admin", err);
      toast.error("Failed to load problems.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isLoggedIn]);

  const handleDelete = async (id: number) => {
    if (!basicAuthHeader) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete problem #${id}?`
    );
    if (!confirmed) return;

    try {
      await deleteProblem(id, basicAuthHeader);
      toast.success("Problem deleted");
      loadProblems();
    } catch (err: any) {
      console.error("Delete problem error", err);
      toast.error("Failed to delete problem.");
    }
  };

  if (!isLoggedIn) {
    return <ProblemAdminLoginForm />;
  }

  const canPrev = page > 0;
  const canNext = problemsPage && page < problemsPage.totalPages - 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Problems</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as:{" "}
            <span className="font-medium text-slate-100">
              {username ?? "admin"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/problems/new">
            <Button>Create Problem</Button>
          </Link>
          <Button variant="outline" onClick={logout}>
            Logout Admin
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-slate-900 border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-300">
            {isLoading ? "Loading..." : "Problem list"}
          </p>
          <p className="text-xs text-slate-400">
            Page {page + 1} / {problemsPage ? problemsPage.totalPages || 1 : 1}
          </p>
        </div>

        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-950">
              <tr className="text-left text-xs text-slate-400">
                <th className="px-3 py-2 border-b border-slate-800">ID</th>
                <th className="px-3 py-2 border-b border-slate-800">Title</th>
                <th className="px-3 py-2 border-b border-slate-800">
                  Difficulty
                </th>
                <th className="px-3 py-2 border-b border-slate-800 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {problemsPage?.content?.map((p) => (
                <tr key={p.id} className="border-b border-slate-800">
                  <td className="px-3 py-2 text-xs text-slate-300">{p.id}</td>
                  <td className="px-3 py-2 text-sm text-slate-100">
                    {p.title}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-300">
                    {p.difficulty}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/problems/${p.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {problemsPage && problemsPage.content.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-sm text-slate-400"
                  >
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2">
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
