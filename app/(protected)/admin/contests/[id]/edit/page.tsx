"use client";

import { fetchContestById, updateContest, addProblemToContest, removeProblemFromContest } from "@/features/contests/api";
import { fetchAdminProblems } from "@/features/problems/admin-api";
import { ContestForm } from "@/components/admin/ContestForm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Box, Hash, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function EditContestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<any>(null);
  const [availableProblems, setAvailableProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProblem, setNewProblem] = useState({ id: "", points: 100, order: 1 });

  const loadData = async () => {
    try {
      const [contestData, problemsData] = await Promise.all([
        fetchContestById(Number(id)),
        fetchAdminProblems(0, 500)
      ]);
      setContest(contestData);
      setAvailableProblems(problemsData.content);
      setNewProblem(prev => ({ ...prev, order: (contestData.problems?.length || 0) + 1 }));
    } catch (err) {
      toast.error("Failed to synchronize administrative protocols.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await updateContest(Number(id), data);
      toast.success("Event sequence re-synchronized.");
      router.push("/admin/contests");
    } catch (err) {
      toast.error("Re-synchronization failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProblem = async () => {
    if (!newProblem.id) return toast.error("Select a problem module first.");
    setIsSubmitting(true);
    try {
      await addProblemToContest(Number(id), Number(newProblem.id), newProblem.points, newProblem.order);
      toast.success("Problem module attached to sequence.");
      await loadData();
    } catch (err) {
      toast.error("Attachment failed. ID conflict or network breach.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProblem = async (problemId: number) => {
    setIsSubmitting(true);
    try {
      await removeProblemFromContest(Number(id), problemId);
      toast.success("Problem module detached.");
      await loadData();
    } catch (err) {
      toast.error("Detachment protocol failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02010a]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02010a] p-8 md:p-12 pb-32">
      <div className="max-w-6xl mx-auto space-y-16">
        <ContestForm 
          title="Modify Sequence" 
          initialData={contest}
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />

        <div className="grid lg:grid-cols-3 gap-12 border-t border-slate-800/50 pt-16">
            <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic text-white leading-tight">Module <span className="text-blue-500">Scheduling</span></h2>
                <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                   Associate algorithmic modules from the global inventory and assign strategic point values.
                </p>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {/* Current Problems */}
                <div className="space-y-4">
                    {contest.problems?.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-900/30 border border-slate-800/80 group hover:border-slate-700 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-slate-500 font-black italic">
                                 {p.order}
                              </div>
                              <div>
                                 <h4 className="font-bold text-white uppercase italic">{p.title}</h4>
                                 <div className="flex items-center gap-3 mt-1">
                                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px]">{p.points} PTS</Badge>
                                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">ID: #{p.id}</span>
                                 </div>
                              </div>
                           </div>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleRemoveProblem(p.id)}
                             className="text-slate-700 hover:text-rose-500 hover:bg-rose-500/10"
                           >
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                    ))}
                </div>

                {/* Add Problem Form */}
                <Card className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-blue-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 italic">Attach New Module</h3>
                    </div>

                    <div className="grid md:grid-cols-6 gap-4">
                        <div className="md:col-span-3">
                            <select 
                                value={newProblem.id}
                                onChange={(e) => setNewProblem({...newProblem, id: e.target.value})}
                                className="w-full bg-slate-950 border-slate-800 h-12 rounded-xl px-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none font-bold uppercase italic"
                            >
                                <option value="">SELECT SOURCE MODULE...</option>
                                {availableProblems
                                  .filter(ap => !contest.problems?.some((cp: any) => cp.id === ap.id))
                                  .map(ap => (
                                    <option key={ap.id} value={ap.id}>{ap.title} ({ap.difficulty})</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <Input 
                                type="number"
                                placeholder="PTS"
                                value={newProblem.points}
                                onChange={(e) => setNewProblem({...newProblem, points: Number(e.target.value)})}
                                className="bg-slate-950/50 border-slate-800 h-12 pl-10 rounded-xl text-xs"
                            />
                        </div>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <Input 
                                type="number"
                                placeholder="ORD"
                                value={newProblem.order}
                                onChange={(e) => setNewProblem({...newProblem, order: Number(e.target.value)})}
                                className="bg-slate-950/50 border-slate-800 h-12 pl-10 rounded-xl text-xs"
                            />
                        </div>
                        <Button 
                          onClick={handleAddProblem}
                          isLoading={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-black text-xs uppercase"
                        >
                           Attach
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
