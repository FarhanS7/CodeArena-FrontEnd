"use client";

import { fetchProblemSubmissions } from "@/features/submissions/api";
import { Submission } from "@/features/submissions/types";
import { 
    Calendar, 
    ChevronRight, 
    Code2, 
    ExternalLink, 
    Loader2, 
    Trophy, 
    User 
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SolutionItem } from "./SolutionItem";

interface SolutionListProps {
  problemId: number;
}

export function SolutionList({ problemId }: SolutionListProps) {
  const [solutions, setSolutions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Fetch only ACCEPTED submissions
        const data = await fetchProblemSubmissions(problemId, "ACCEPTED");
        setSolutions(data);
      } catch (err) {
        console.error("Failed to fetch solutions", err);
        setError("Could not load community solutions.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Curating best approaches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 font-medium">{error}</p>
        <Button 
          variant="link" 
          onClick={() => window.location.reload()}
          className="text-blue-500"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (solutions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center">
          <Trophy className="w-8 h-8 text-slate-700" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-300">Be the first!</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            No solutions have been shared for this problem yet. Solve it and lead the way.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-100 italic">Community Hall of Fame</h2>
          <p className="text-xs text-slate-500">Explore optimized solutions from top performers</p>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {solutions.length} ACCEPTED
        </div>
      </div>

      <div className="grid gap-4">
        {solutions.map((solution) => (
          <SolutionItem key={solution.id} solution={solution} />
        ))}
      </div>
    </div>
  );
}
