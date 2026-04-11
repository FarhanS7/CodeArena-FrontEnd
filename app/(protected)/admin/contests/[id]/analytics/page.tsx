"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { fetchContestAnalytics } from "@/features/contests/api";
import { 
    Activity, 
    BarChart3, 
    ChevronLeft, 
    Clock, 
    Loader2, 
    PieChart, 
    Target, 
    TrendingUp, 
    Trophy,
    Users, 
    Zap 
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContestAnalyticsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const analytics = await fetchContestAnalytics(Number(id));
        setData(analytics);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Parsing Event Streams...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02010a] text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <Link href="/contests" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm mb-4">
                <ChevronLeft className="w-4 h-4" />
                Control Center
              </Link>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic underline underline-offset-[12px] decoration-blue-500/20">
                {data.title} <span className="text-blue-500">Analytics</span>
              </h1>
              <div className="flex items-center gap-3 pt-2">
                 <div className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                    Event Node #{data.contestId}
                 </div>
                 <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Real-time Synchronization Active
                 </div>
              </div>
           </div>
           
           <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Activity className="w-6 h-6 text-blue-500" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Load</div>
                    <div className="text-lg font-black text-white italic">OPTIONAL CAPACITY</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard label="Total Operatives" value={data.totalParticipants} icon={<Users className="w-5 h-5" />} color="blue" />
           <StatCard label="Avg Clearance Score" value={data.averageScore.toFixed(0)} icon={<Target className="w-5 h-5" />} color="emerald" />
           <StatCard label="Clearance Rate" value={`${(data.finishRate * 100).toFixed(1)}%`} icon={<Zap className="w-5 h-5" />} color="amber" />
           <StatCard label="Mission Peak Score" value={data.topScore} icon={<Trophy className="w-5 h-5" />} color="purple" />
        </div>

        {/* Deep Insights */}
        <div className="grid lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 bg-[#0a0a0f] border-slate-800/80 p-10 rounded-[2.5rem] space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-bold uppercase tracking-widest text-slate-200 italic">Participation Flux</h3>
                 </div>
                 <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Updates every 30s</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <Metric label="Registered" value={data.participationStats.registered} total={data.totalParticipants} color="#3b82f6" />
                 <Metric label="Participating" value={data.participationStats.participating} total={data.totalParticipants} color="#10b981" />
                 <Metric label="Finished" value={data.participationStats.finished} total={data.totalParticipants} color="#6366f1" />
                 <Metric label="Disqualified" value={data.participationStats.disqualified} total={data.totalParticipants} color="#ef4444" />
              </div>

              <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800/50">
                 <div style={{ width: `${(data.participationStats.finished / data.totalParticipants) * 100}%` }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                 <div style={{ width: `${(data.participationStats.participating / data.totalParticipants) * 100}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              </div>
           </Card>

           <Card className="bg-[#0a0a0f] border-slate-800/80 p-10 rounded-[2.5rem] space-y-8">
              <div className="flex items-center gap-3">
                 <PieChart className="w-5 h-5 text-purple-500" />
                 <h3 className="text-xl font-bold uppercase tracking-widest text-slate-200 italic">Event Health</h3>
              </div>
              <div className="space-y-6">
                 <HealthItem label="Transmission Stability" percentage="99.8%" />
                 <HealthItem label="Auth Node Security" percentage="100%" />
                 <HealthItem label="Judge Response Time" percentage="450ms" />
              </div>
              <div className="pt-6 border-t border-slate-800/50">
                <p className="text-xs text-slate-500 italic opacity-50">
                  Mission critical systems are operating within expected parameters. All encryption layers intact.
                </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
    const colorClasses: any = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    };

    return (
        <Card className="bg-[#0a0a0f] border-slate-800/80 p-8 rounded-[2rem] space-y-4 hover:border-slate-700 transition-all cursor-crosshair group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</div>
                <div className="text-3xl font-black text-white italic tracking-tighter mt-1">{value}</div>
            </div>
        </Card>
    );
}

function Metric({ label, value, total, color }: any) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-2xl font-black text-white italic">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/30">
                <div style={{ width: `${(value / (total || 1)) * 100}%`, backgroundColor: color }} className="h-full rounded-full opacity-80" />
            </div>
        </div>
    );
}

function HealthItem({ label, percentage }: any) {
    return (
        <div className="flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
           <span className="text-emerald-500 font-black italic tabular-nums">{percentage}</span>
        </div>
    );
}
