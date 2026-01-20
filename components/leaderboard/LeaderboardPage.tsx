"use client";

import { Button } from "@/components/ui/button";
import { RankingItem, fetchGlobalLeaderboard } from "@/features/leaderboard/api";
import { Loader2, Medal, Star, Trophy, User, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LeaderboardPage() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGlobalLeaderboard(50);
        setRankings(data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-400 font-medium">Calculating rankings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest">
          <Trophy className="w-3 h-3" />
          Global Standings
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Hall of <span className="text-amber-500 italic">Fame</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Honoring the fastest and most efficient problem solvers in the Code Arena community.
        </p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8">
        {/* Rank 2 */}
        {rankings[1] && (
          <div className="order-2 md:order-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute top-0 inset-x-0 h-1 bg-slate-400/50" />
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-2xl font-black text-slate-400">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{rankings[1].username}</h3>
              <div className="text-amber-500 font-mono font-bold">{rankings[1].score} PTS</div>
            </div>
            <Medal className="w-12 h-12 text-slate-400/20 absolute -bottom-2 -right-2 rotate-12" />
          </div>
        )}

        {/* Rank 1 */}
        {rankings[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/20 to-slate-900/50 border-2 border-amber-500/50 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-amber-500/10 scale-105 group hover:border-amber-500 transition-all">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500" />
            <div className="relative">
                <Trophy className="w-8 h-8 text-amber-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-24 h-24 rounded-full bg-amber-500 mx-auto flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-amber-500/20">
                    1
                </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1">{rankings[0].username}</h3>
              <div className="text-amber-500 text-lg font-mono font-black">{rankings[0].score} PTS</div>
            </div>
            <Zap className="w-24 h-24 text-amber-500/10 absolute -bottom-4 -left-4 -rotate-12" />
          </div>
        )}

        {/* Rank 3 */}
        {rankings[2] && (
          <div className="order-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute top-0 inset-x-0 h-1 bg-amber-700/50" />
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-2xl font-black text-amber-700">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{rankings[2].username}</h3>
              <div className="text-amber-500 font-mono font-bold">{rankings[2].score} PTS</div>
            </div>
            <Star className="w-12 h-12 text-amber-700/20 absolute -bottom-2 -right-2 -rotate-12" />
          </div>
        )}
      </div>

      {/* Remaining Rankings Table */}
      <div className="bg-slate-900/30 rounded-3xl border border-slate-800/50 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Rank</th>
              <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Warrior</th>
              <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Rating Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {rankings.slice(3).map((item) => (
              <tr key={item.userId} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-6">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-xs font-bold text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-all">
                    {item.rank}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-bold text-slate-200 group-hover:text-white">{item.username}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="font-mono font-bold text-amber-500/80 group-hover:text-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all">
                    {item.score.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {rankings.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Trophy className="w-12 h-12 text-slate-800 mx-auto" />
            <p className="text-slate-500 font-medium tracking-tight">The arena is quiet... no battles won yet.</p>
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="text-center pt-8">
        <Button asChild className="bg-amber-600 hover:bg-amber-500 text-white font-black px-10 h-12 rounded-full shadow-xl shadow-amber-900/20">
          <Link href="/problems">Claim Your Rank</Link>
        </Button>
      </div>
    </div>
  );
}
