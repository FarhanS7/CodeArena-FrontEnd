"use client";

import { fetchAdminProblems, deleteAdminProblem } from "@/features/problems/admin-api";
import { AdminProblem } from "@/features/problems/admin-api";
import { 
    Plus, 
    Settings, 
    Trash2, 
    Code2, 
    Search,
    Edit2,
    Loader2,
    Layers
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminProblems();
      setProblems(data.content);
    } catch (err) {
      toast.error("Resource error: Problem registry inaccessible.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Decommission this problem sequence? This will affect all active contests using this ID.")) return;
    
    try {
      await deleteAdminProblem(id);
      toast.success("Problem decommissioned.");
      load();
    } catch (err) {
      toast.error("Decommission protocol failed.");
    }
  };

  const filtered = problems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#01030d] text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight uppercase italic text-white flex items-center gap-4">
                 <Layers className="w-8 h-8 text-emerald-500" />
                 Module <span className="text-emerald-400">Inventory</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Security Clearance: LEVEL 4 AUDITOR</p>
           </div>
           
           <Link href="/admin/problems/new">
             <Button className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black gap-3 shadow-2xl shadow-emerald-500/20">
                <Plus className="w-5 h-5" />
                Forge New Module
             </Button>
           </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
            placeholder="Query problem matrices..." 
            className="pl-10 bg-slate-900/50 border-slate-800 focus:ring-emerald-500/20 h-11 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Grid/Table */}
        <div className="bg-[#05091a]/80 border border-slate-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
           {isLoading ? (
             <div className="p-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Uploading local problem manifest...</p>
             </div>
           ) : filtered.length === 0 ? (
             <div className="p-24 text-center space-y-4">
                <Code2 className="w-12 h-12 text-slate-800 mx-auto" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active modules detected.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-800/50 bg-slate-900/40">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">ID</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Problem Designation</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Complexity</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Operation Status</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/30">
                      {filtered.map((problem) => (
                        <tr key={problem.id} className="group hover:bg-emerald-500/[0.02] transition-colors">
                           <td className="px-8 py-6 text-xs font-mono text-slate-500 italic">#{problem.id}</td>
                           <td className="px-8 py-6">
                              <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase italic">{problem.title}</span>
                           </td>
                           <td className="px-8 py-6">
                              <Badge className={`
                                 ${problem.difficulty === 'HARD' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                   problem.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                   'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}
                              `}>
                                 {problem.difficulty}
                              </Badge>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Link href={`/admin/problems/${problem.id}/edit`}>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10">
                                       <Edit2 className="w-4 h-4" />
                                    </Button>
                                 </Link>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(problem.id)}
                                    className="h-9 w-9 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </Button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
