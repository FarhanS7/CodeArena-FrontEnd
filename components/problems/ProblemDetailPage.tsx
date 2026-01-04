// src/components/problems/ProblemDetailPage.tsx
"use client";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { Card } from "@/components/ui/card";
import { fetchProblemById } from "@/features/problems/api";
import type { ProblemDetail } from "@/features/problems/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      setNotFound(false);
      try {
        const idNum = Number(params.id);
        const data = await fetchProblemById(idNum);
        if (!data) {
          setNotFound(true);
        } else {
          setProblem(data);
        }
      } catch (err) {
        console.error("Failed to load problem", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params]);

  if (isLoading) return <FullScreenLoader />;

  if (notFound || !problem) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Problem not found</h1>
        <p className="text-sm text-slate-300">
          The problem you&apos;re looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-400 mb-1">
          Problem #{problem.id} · {problem.difficulty}
        </p>
        <h1 className="text-3xl font-semibold">{problem.title}</h1>
      </div>

      <Card className="p-5 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="whitespace-pre-line text-sm text-slate-200">
          {problem.description}
        </p>
      </Card>

      {(problem.exampleInput || problem.exampleOutput) && (
        <Card className="p-5 bg-slate-900 border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          {problem.exampleInput && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Input
              </div>
              <pre className="rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 overflow-auto">
                {problem.exampleInput}
              </pre>
            </div>
          )}
          {problem.exampleOutput && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Output
              </div>
              <pre className="rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 overflow-auto">
                {problem.exampleOutput}
              </pre>
            </div>
          )}
        </Card>
      )}

      {problem.testCases && problem.testCases.length > 0 && (
        <Card className="p-5 bg-slate-900 border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold">Test Cases</h2>
          <p className="text-xs text-slate-400">
            Hidden in real judges, but visible here for debugging/admin.
          </p>
          <div className="space-y-3">
            {problem.testCases.map((tc) => (
              <div
                key={tc.id}
                className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs space-y-1"
              >
                <div className="text-[10px] text-slate-500">
                  TestCase #{tc.id}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Input:</span>
                  <pre className="mt-1 whitespace-pre-line">{tc.input}</pre>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">
                    Expected Output:
                  </span>
                  <pre className="mt-1 whitespace-pre-line">
                    {tc.expectedOutput}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
