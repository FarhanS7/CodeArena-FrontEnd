"use client";

import { RoleGuard } from "@/features/auth/RoleGuard";
import { 
    ShieldAlert, 
    Trophy, 
    Layers, 
    BarChart3, 
    Users, 
    Activity,
    ChevronRight,
    Terminal,
    Database,
    Lock
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#02010a] text-white p-8 md:p-12">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/50 pb-12">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" />
                      Root Terminal Access
                   </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                   Command <span className="text-blue-500">Center</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Awaiting strategic directives...</p>
             </div>
             
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                   <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Latency</div>
                   <div className="text-xl font-black text-white italic tabular-nums mt-1">12ms</div>
                </div>
             </div>
          </div>

          {/* Core Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AdminModuleCard 
               title="Event Sequences" 
               description="Control and initialize competitive event nodes across the global matrix."
               icon={<Trophy className="w-8 h-8 text-blue-500" />}
               link="/admin/contests"
               stats="14 Active Sequences"
               accent="blue"
             />
             <AdminModuleCard 
               title="Module Inventory" 
               description="Calibrate algorithmic challenges and validation test cases."
               icon={<Layers className="w-8 h-8 text-emerald-500" />}
               link="/admin/problems"
               stats="128 Problem Modules"
               accent="emerald"
             />
             <AdminModuleCard 
               title="User Analytics" 
               description="Monitor participant performance and strategic growth patterns."
               icon={<Users className="w-8 h-8 text-purple-500" />}
               link="/admin/contests" // Placeholder for general analytics
               stats="2,401 Operatives"
               accent="purple"
             />
          </div>

          {/* System Integrity & Diagnostics */}
          <div className="grid lg:grid-cols-2 gap-12">
             <Card className="bg-[#0a0a0f] border-slate-800/80 p-10 rounded-[2.5rem] space-y-8">
                <div className="flex items-center gap-4">
                   <Terminal className="w-6 h-6 text-slate-500" />
                   <h3 className="text-xl font-bold uppercase tracking-widest text-slate-200 italic">System Console</h3>
                </div>
                <div className="space-y-4 font-mono text-xs text-slate-500">
                   <div className="flex items-center gap-4">
                      <span className="text-emerald-500 font-bold">[READY]</span>
                      <span>Auth service handshaking complete.</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-emerald-500 font-bold">[READY]</span>
                      <span>Problem-service (Java/Spring) synchronized.</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-blue-500 font-bold">[INFO ]</span>
                      <span>12 new registration requests in queue.</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-amber-500 font-bold">[WARN ]</span>
                      <span>Latency spike detected in Judge-0 Node A.</span>
                   </div>
                </div>
             </Card>

             <Card className="bg-[#0a0a0f] border-slate-800/80 p-10 rounded-[2.5rem] space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center gap-4">
                   <Database className="w-6 h-6 text-slate-500" />
                   <h3 className="text-xl font-bold uppercase tracking-widest text-slate-200 italic">Data Integrity</h3>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Backups</span>
                      <span className="text-emerald-500 font-black italic">SECURED</span>
                   </div>
                   <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                      <div className="w-[85%] h-full bg-emerald-500/50" />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Storage Capacity</span>
                      <span className="text-slate-200 font-black italic">85.4%</span>
                   </div>
                </div>
             </Card>
          </div>

        </div>
      </div>
    </RoleGuard>
  );
}

function AdminModuleCard({ title, description, icon, link, stats, accent }: any) {
  const accentColors: any = {
    blue: "group-hover:text-blue-500 group-hover:border-blue-500/20",
    emerald: "group-hover:text-emerald-500 group-hover:border-emerald-500/20",
    purple: "group-hover:text-purple-500 group-hover:border-purple-500/20"
  };

  return (
    <Link href={link}>
       <Card className={`group bg-[#0a0a0f] border-slate-800/80 p-10 rounded-[3rem] space-y-8 transition-all hover:scale-[1.02] cursor-pointer hover:border-slate-700 ${accentColors[accent]}`}>
          <div className="flex items-center justify-between">
             <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 transition-colors ${accentColors[accent]}`}>
                {icon}
             </div>
             <ChevronRight className="w-6 h-6 text-slate-800 group-hover:text-white transition-all transform group-hover:translate-x-2" />
          </div>
          <div className="space-y-4">
             <h2 className="text-2xl font-black uppercase italic text-white leading-none">{title}</h2>
             <p className="text-slate-500 text-sm font-bold leading-relaxed">{description}</p>
          </div>
          <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stats}</span>
             <Link href={link} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                Open Module
             </Link>
          </div>
       </Card>
    </Link>
  );
}
