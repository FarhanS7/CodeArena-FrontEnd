// src/app/(protected)/admin/problems/[id]/edit/page.tsx
"use client";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { ProblemForm } from "@/components/problemAdmin/ProblemForm";
import { useProblemAdminAuth } from "@/features/problemAdmin/ProblemAdminAuthProvider";
import { fetchProblemById, updateProblem } from "@/features/problems/api";
import type { ProblemDetail } from "@/features/problems/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminEditProblemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { basicAuthHeader, isLoggedIn } = useProblemAdminAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      try {
        const idNum = Number(params.id);
        const data = await fetchProblemById(idNum);
        if (!data) {
          setNotFound(true);
        } else {
          setProblem(data);
        }
      } catch (err) {
        console.error("Failed to load problem for edit", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params]);

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-slate-300">
        Please go back and log in as Problem Admin.
      </p>
    );
  }

  if (isLoading) return <FullScreenLoader />;

  if (notFound || !problem) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Problem not found</h1>
        <p className="text-sm text-slate-300">
          Cannot edit because this problem does not exist.
        </p>
      </div>
    );
  }

  const handleSubmit = async (payload: any) => {
    if (!basicAuthHeader) return;
    try {
      const res = await updateProblem(problem.id, payload, basicAuthHeader);
      toast.success("Problem updated", {
        description: `ID: ${res.id}`,
      });
      router.push("/admin/problems");
    } catch (err: any) {
      console.error("Update problem error", err);
      toast.error("Failed to update problem.");
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Problem #{problem.id}</h1>
      <ProblemForm
        initial={problem}
        onSubmit={handleSubmit}
        submitLabel="Update Problem"
      />
    </div>
  );
}
