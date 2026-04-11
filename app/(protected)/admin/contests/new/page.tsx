"use client";

import { createContest } from "@/features/contests/api";
import { ContestForm } from "@/components/admin/ContestForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewContestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createContest(data);
      toast.success("New event sequence initialized successfully.");
      router.push("/admin/contests");
    } catch (err) {
      toast.error("Initialization failed. Transmission corrupted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02010a] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <ContestForm 
          title="Initialize Contest" 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
}
