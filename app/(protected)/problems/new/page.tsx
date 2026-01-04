// src/app/(protected)/admin/problems/new/page.tsx
"use client";

import { ProblemForm } from "@/components/problemAdmin/ProblemForm";
import { useProblemAdminAuth } from "@/features/problemAdmin/ProblemAdminAuthProvider";
import { createProblem } from "@/features/problems/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminCreateProblemPage() {
  const { basicAuthHeader, isLoggedIn } = useProblemAdminAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-slate-300">
        Please go back and log in as Problem Admin.
      </p>
    );
  }

  const handleSubmit = async (payload: any) => {
    if (!basicAuthHeader) return;
    try {
      const res = await createProblem(payload, basicAuthHeader);
      toast.success("Problem created", {
        description: `ID: ${res.id}`,
      });
      router.push("/admin/problems");
    } catch (err: any) {
      console.error("Create problem error", err);
      toast.error("Failed to create problem.");
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Problem</h1>
      <ProblemForm onSubmit={handleSubmit} submitLabel="Create Problem" />
    </div>
  );
}
