"use client";

import { fetchAdminProblemById, updateAdminProblem } from "@/features/problems/admin-api";
import { ProblemForm } from "@/components/admin/ProblemForm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditProblemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminProblemById(Number(id));
        setProblem(data);
      } catch (err) {
        toast.error("Resource recovery failed.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await updateAdminProblem(Number(id), data);
      toast.success("Problem matrix recalibrated.");
      router.push("/admin/problems");
    } catch (err) {
      toast.error("Recalibration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#01030d]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#01030d] p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <ProblemForm 
          title="Recalibrate Module" 
          initialData={problem}
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
}
