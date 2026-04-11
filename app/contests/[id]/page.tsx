"use client";

import { fetchContestById, fetchUserParticipation, registerForContest, startContest } from "@/features/contests/api";
import { ContestDetail, Participant } from "@/features/contests/types";
import { 
    Calendar, 
    CheckCircle2, 
    ChevronLeft, 
    Clock, 
    Info, 
    Loader2, 
    Lock, 
    Play, 
    ShieldCheck, 
    Trophy, 
    Users 
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContestCountdown } from "@/components/contests/ContestCountdown";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";

export default function ContestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [participation, setParticipation] = useState<Participant | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [cData, pData] = await Promise.all([
          fetchContestById(Number(id)),
          fetchUserParticipation(Number(id))
        ]);
        setContest(cData);
        setIsRegistered(pData.isRegistered);
        setParticipation(pData.participation);
      } catch (err) {
        console.error("Failed to load contest detail", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRegister = async () => {
    setIsActionLoading(true);
    try {
      await registerForContest(Number(id));
      setIsRegistered(true);
      toast.success("Identity verified. You are registered for the event.");
    } catch (err) {
      toast.error("Standard clearance failed. Try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStart = async () => {
    setIsActionLoading(true);
    try {
      await startContest(Number(id));
      router.push(`/contests/${id}/arena`);
    } catch (err) {
      toast.error("Initialization error. Transmission unstable.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading || !contest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Accessing Arena Node...</p>
      </div>
    );
  }

  const isOngoing = contest.status === "ONGOING";
  const isUpcoming = contest.status === "UPCOMING";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-24">
      {/* Header / Banner */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link href="/contests" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Arena
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  {contest.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-slate-500/10 border-slate-500/20 text-slate-400 uppercase">
                  {contest.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
                {contest.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(contest.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {contest.participantCount} registered
                </div>
              </div>
            </div>

            {isUpcoming && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right md:text-right">Time Until Breach</p>
                <ContestCountdown targetDate={contest.startTime} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12">
        {/* Left Column: Rules & Info */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-200">Protocol Overview</h2>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg">
              {contest.description}
            </p>
          </section>

          <section className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 space-y-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-200">Execution Directives</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Point Aggregation", desc: "Problems carry varying weight. Solve complex modules for higher ranking." },
                { title: "Penalty Logic", desc: "Each failed attempt adds a 10-minute penalty to your final sequence time." },
                { title: "Zero Interference", desc: "External communication or AI assistance beyond system hints is prohibited." },
                { title: "Sequence Locked", desc: "Final solutions must be accepted before the end of the maintenance window." },
              ].map((rule) => (
                <div key={rule.title} className="space-y-2">
                  <h4 className="font-bold text-slate-200">{rule.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Actions & Sidebar */}
        <div className="space-y-8">
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 space-y-8 backdrop-blur-sm sticky top-24">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic underline underline-offset-8 decoration-blue-500/30">Entry Status</h3>
              <p className="text-sm text-slate-500 pt-2">Verification level: {isRegistered ? "AUTHENTICATED" : "GUEST"}</p>
            </div>

            <div className="space-y-4">
              {!isRegistered ? (
                <Button 
                  onClick={handleRegister}
                  isLoading={isActionLoading}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg gap-3 shadow-2xl shadow-blue-500/20"
                >
                  <Lock className="w-5 h-5" />
                  Request Access
                </Button>
              ) : isOngoing ? (
                <Button 
                  onClick={handleStart}
                  isLoading={isActionLoading}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg gap-3 shadow-2xl shadow-emerald-500/20 animate-pulse"
                >
                  <Play className="w-5 h-5" />
                  Begin Transmission
                </Button>
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-300 italic uppercase">Clearance Granted. Stand by.</span>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-800/50 space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-bold uppercase tracking-tighter">Event Class</span>
                 <span className="text-white font-black italic">{contest.difficulty} CORE</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-bold uppercase tracking-tighter">Total Rewards</span>
                 <span className="text-blue-400 font-black italic">{contest.totalProblems * 100} XP</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
