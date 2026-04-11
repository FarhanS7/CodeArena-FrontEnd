"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { fetchContestById, fetchContestLeaderboard, fetchUserParticipation } from "@/features/contests/api";
import { ContestDetail, Participant, ContestLeaderboard } from "@/features/contests/types";
import {
    Clock,
    Code2,
    Layout,
    Loader2,
    MessageSquare,
    Trophy,
    ChevronLeft,
    ChevronRight,
    Zap
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/problems/CodeEditor";
import { AiHintPanel } from "@/components/problems/AiHintPanel";
import { ContestTimer } from "@/components/contests/ContestTimer";
import { SubmissionForm } from "@/components/contests/SubmissionForm";
import { SubmissionStatusBadge } from "@/components/contests/SubmissionStatusBadge";
import { SubmissionHistory } from "@/components/contests/SubmissionHistory";
import { toast } from "sonner";
import { useSocket } from "@/features/hooks/useSocket";

interface ContestSubmission {
  id: string;
  problemLabel: string;
  status: string;
  time: string;
  score?: number;
  language?: string;
}

interface VerdictData {
  submissionId: string;
  status: string;
  testResults?: any;
  compilationError?: string;
  runtimeError?: string;
}

export default function ContestArenaPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { on, off } = useSocket(user?.id);

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [participation, setParticipation] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Problem Index
  const [problemIndex, setProblemIndex] = useState(0);

  // Editor State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Submission State
  const [submissions, setSubmissions] = useState<ContestSubmission[]>([]);
  const [latestVerdict, setLatestVerdict] = useState<VerdictData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboard | null>(null);

  // AI Hint State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Handle RUN button - test against examples only
  const handleRun = async (data: {
    executionType: 'RUN';
    code: string;
    language: string;
    problemId?: string;
  }) => {
    if (!contest) return;

    const currentProblem = contest.problems[problemIndex];
    toast.info("Running code against examples...");

    try {
      // Call execution service with RUN type (examples only)
      const response = await fetch("/api/submissions/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: currentProblem.id,
          sourceCode: data.code,
          language: data.language,
          executionType: "RUN", // Examples only
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLatestVerdict({
          submissionId: result.data.id,
          status: result.data.status,
          testResults: result.data.testResults,
          compilationError: result.data.compilationError,
          runtimeError: result.data.runtimeError,
        });

        if (result.data.status === "ACCEPTED") {
          toast.success("All examples passed! ✨");
        } else {
          toast.error(`Examples failed: ${result.data.status}`);
        }
      } else {
        toast.error(result.message || "Failed to run code");
      }
    } catch (err) {
      console.error("Run error:", err);
      toast.error("Failed to run code against examples");
    }
  };

  // Handle SUBMIT button - full contest submission
  const handleSubmit = async (data: {
    executionType: 'SUBMIT';
    code: string;
    language: string;
    contestId: string;
    problemId: string;
  }) => {
    if (!contest) return;

    const currentProblem = contest.problems[problemIndex];
    setIsSubmitting(true);
    toast.info("Submitting solution to contest...");

    try {
      // Call contest service submit endpoint
      const response = await fetch(`/api/contests/${contest.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: currentProblem.id,
          sourceCode: data.code,
          language: data.language,
          contestId: contest.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add to submission history
        setSubmissions((prev) => [
          {
            id: result.data.submissionId,
            problemLabel: `Problem ${String.fromCharCode(65 + problemIndex)}`,
            status: "PENDING",
            time: new Date().toISOString(),
            language: data.language,
          },
          ...prev,
        ]);

        toast.success("Submission received! Awaiting verdict...");

        // Start listening for verdict via WebSocket
        on("submission-verdict", (verdict: VerdictData) => {
          if (verdict.submissionId === result.data.submissionId) {
            setLatestVerdict(verdict);
            setSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === result.data.submissionId
                  ? { ...sub, status: verdict.status, score: 100 } // Score calculation would be more complex
                  : sub
              )
            );

            toast.success(`Verdict: ${verdict.status}`, {
              duration: 3000,
            });
          }
        });
      } else {
        toast.error(result.message || "Failed to submit solution");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [cData, pData, lData] = await Promise.all([
          fetchContestById(Number(id)),
          fetchUserParticipation(Number(id)),
          fetchContestLeaderboard(Number(id)),
        ]);

        if (!pData.isRegistered) {
          toast.error("Access denied. Identity not registered for this event.");
          router.push(`/contests/${id}`);
          return;
        }

        setContest(cData);
        setParticipation(pData.participation);
        setLeaderboard(lData || []);

        // Subscribe to real-time updates
        on("submission-verdict", (verdict: VerdictData) => {
          setLatestVerdict(verdict);
        });

        on("contest-leaderboard-update", (data: any) => {
          setLeaderboard(data);
        });
      } catch (err) {
        console.error("Failed to load arena", err);
        toast.error("Failed to load contest arena");
      } finally {
        setIsLoading(false);
      }
    };
    load();

    return () => {
      off("submission-verdict");
      off("contest-leaderboard-update");
    };
  }, [id, router, on, off]);

  if (isLoading || !contest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Entering Arena Matrix...</p>
      </div>
    );
  }

  const currentProblem = contest.problems[problemIndex];

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden">
      {/* Top Navigation / Status Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-6">
          <Link href={`/contests/${id}`} className="p-2 hover:bg-slate-900 rounded-lg transition-colors group">
            <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-white" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] italic text-emerald-500">
              {contest.title}
            </h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest">
              MISSION IN PROGRESS • PROTOCOL ACTIVE
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {/* Contest Timer */}
          <ContestTimer
            endTime={new Date(contest.endTime)}
            onTimeUp={() => {
              toast.info("Contest time has ended!");
              // Auto-submit or show final standings
            }}
          />
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold tracking-widest leading-none mb-1">SCORE AGGREGATE</span>
            <span className="text-xl font-black tabular-nums tracking-tighter text-emerald-400 italic">
              {participation?.totalScore || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-9 border-slate-800 bg-slate-900/50 text-xs font-bold gap-2 px-4 shadow-xl shadow-emerald-900/5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Live Rank: #{leaderboard?.participants ? leaderboard.participants.length : '?'}
          </Button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-blue-400 uppercase italic">
            {user?.username?.[0] || 'U'}
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Problem Selector */}
        <aside className="w-72 border-r border-slate-800/80 bg-[#04091a] flex flex-col z-10">
          <div className="p-6 border-b border-slate-800/80">
            <h3 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.3em]">Sequence Stack</h3>
            <div className="space-y-3">
              {contest.problems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setProblemIndex(i)}
                  className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    problemIndex === i 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-900/10" 
                      : "bg-slate-900/30 border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black italic opacity-50">0{i+1}</span>
                    <span className="text-[13px] font-bold tracking-tight truncate max-w-[140px]">{p.title}</span>
                  </div>
                  {problemIndex === i ? (
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mini Leaderboard Placeholder */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
             <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">Breach Status</h3>
             <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { name: "BinaryNinja", score: 4500 },
                  { name: "VoidWalker", score: 4200 },
                  { name: "CyberSage", score: 3900 },
                  { name: "QuantumDev", score: 3850 },
                  { name: "X-Runner", score: 3800 },
                ].map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-600 italic">0{i+1}</span>
                       <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{p.name}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-500 tabular-nums">{p.score}</span>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* Center: Workspace Area */}
        <section className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Gradient Overlays */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Problem View & Editor with Results */}
          <div className="flex-1 grid md:grid-cols-3 overflow-hidden gap-0">
            {/* Problem Description */}
            <div className="flex flex-col border-r border-slate-800/80 overflow-y-auto p-6 custom-scrollbar col-span-1">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded bg-slate-900 border border-slate-800 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  Module ID: {currentProblem.id} • {currentProblem.points} XP
                </div>
                <h2 className="text-3xl font-black tracking-tight">{currentProblem.title}</h2>
                <div className="prose prose-invert prose-slate max-w-none text-slate-400 leading-relaxed italic">
                  Decrypt the encrypted algorithm sequence to reveal the underlying data pattern. Ensure O(N) efficiency for maximum clearance.
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex flex-col overflow-hidden bg-[#0a0a0a] border-r border-slate-800/80 col-span-1">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transmission Terminal</span>
                </div>
              </div>
              <div className="flex-1 relative">
                <CodeEditor
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  language={language}
                />
              </div>
              <div className="p-6 border-t border-white/5 bg-black/60 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsAiPanelOpen(true)}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-500 transition-colors uppercase tracking-widest">Request Hint</span>
                  </div>
                </div>

                {/* Submission Form */}
                <SubmissionForm
                  code={code}
                  language={language}
                  contestId={contest?.id.toString()}
                  problemId={currentProblem.id.toString()}
                  onLanguageChange={setLanguage}
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Results & Submission History Panel */}
            <div className="flex flex-col overflow-hidden bg-slate-900/30 border-l border-slate-800/80 col-span-1">
              <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verdict & History</span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                {/* Latest Verdict */}
                {latestVerdict && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Latest Verdict
                    </h3>
                    <SubmissionStatusBadge
                      status={latestVerdict.status as any}
                      testResults={latestVerdict.testResults}
                      compilationError={latestVerdict.compilationError}
                      runtimeError={latestVerdict.runtimeError}
                    />
                  </div>
                )}

                {/* Submission History */}
                <SubmissionHistory
                  submissions={submissions}
                  onSubmissionClick={(sub) => {
                    // Could expand to show full details
                    console.log("Clicked submission:", sub);
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Global Floating AI Component Placeholder */}
        <AiHintPanel 
          isOpen={isAiPanelOpen} 
          onClose={() => setIsAiPanelOpen(false)} 
          problemId={currentProblem.id}
          code={code}
          language={language}
        />
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
