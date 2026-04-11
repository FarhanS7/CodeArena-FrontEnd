"use client";

import { createAdminProblem } from "@/features/problems/admin-api";
import { ProblemForm } from "@/components/admin/ProblemForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewProblemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createAdminProblem(data);
      toast.success("Problem module forged successfully.");
      router.push("/admin/problems");
    } catch (err) {
      toast.error("Forge protocol interrupted. Data corrupted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#01030d] p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <ProblemForm 
          title="Forge Problem" 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
}
