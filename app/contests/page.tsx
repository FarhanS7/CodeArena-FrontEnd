"use client";

import { fetchContests } from "@/features/contests/api";
import { Contest } from "@/features/contests/types";
import { 
    Calendar, 
    Clock, 
    Loader2, 
    Trophy, 
    Users, 
    Zap,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchContests(filter === "ALL" ? undefined : filter);
        setContests(data.contests);
      } catch (err) {
        console.error("Failed to fetch contests", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Trophy className="w-3 h-3" />
            Competitive Arena
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">Clash</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Prove your mastery in timed challenges. Compete with the best engineers worldwide for glory and prestige.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-sm">
            {["ALL", "ONGOING", "UPCOMING", "FINISHED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${
                  filter === tab 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Find a tournament..." 
              className="pl-10 bg-slate-900/50 border-slate-800 focus:ring-blue-500/20 h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px]">Synchronizing Arena Status...</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border border-slate-800">
              <Zap className="w-10 h-10 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-300 italic">Calm Before the Storm</h3>
              <p className="text-slate-500 text-sm mt-1">Check back later for new scheduled events.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contests.map((contest) => (
              <Link key={contest.id} href={`/contests/${contest.id}`}>
                <div className="group relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all hover:translate-y-[-4px]">
                  <div className="absolute top-8 right-8">
                    <Badge className={`
                      bg-opacity-10 border 
                      ${contest.status === 'ONGOING' ? 'bg-emerald-500 text-emerald-500 border-emerald-500/20' : 
                        contest.status === 'UPCOMING' ? 'bg-blue-500 text-blue-500 border-blue-500/20' : 
                        'bg-slate-500 text-slate-500 border-slate-500/20'}
                    `}>
                      {contest.status}
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform">
                      <Trophy className={`w-7 h-7 ${contest.status === 'ONGOING' ? 'text-emerald-500' : 'text-blue-500'}`} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">
                        {contest.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                        {contest.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {contest.participantCount} Players
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {contest.totalProblems} Challenges
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                         Ends {new Date(contest.endTime).toLocaleDateString()}
                       </span>
                       <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-colors translate-x-0 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
