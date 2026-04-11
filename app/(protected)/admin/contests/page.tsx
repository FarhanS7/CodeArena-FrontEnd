"use client";

import { fetchContests, deleteContest } from "@/features/contests/api";
import { Contest } from "@/features/contests/types";
import { 
    Plus, 
    Settings, 
    Trash2, 
    BarChart3, 
    Calendar, 
    Users, 
    Loader2, 
    Search,
    Edit2
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContests();
      setContests(data.contests);
    } catch (err) {
      toast.error("Security breach: Failed to synchronize event data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to terminate this event sequence? This action is irreversible.")) return;
    
    try {
      await deleteContest(id);
      toast.success("Event sequence terminated successfully.");
      load();
    } catch (err) {
      toast.error("Termination failed. System integrity protected.");
    }
  };

  const filtered = contests.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#02010a] text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight uppercase italic text-white flex items-center gap-4">
                 <Settings className="w-8 h-8 text-blue-500" />
                 Contest <span className="text-blue-500">Node Management</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Administrative Clearance Level: ALPHA</p>
           </div>
           
           <Link href="/admin/contests/new">
             <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black gap-3 shadow-2xl shadow-blue-500/20">
                <Plus className="w-5 h-5" />
                Initialize New Event
             </Button>
           </Link>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search event registry..." 
                className="pl-10 bg-slate-900/50 border-slate-800 focus:ring-blue-500/20 h-11 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {/* Table/List */}
        <div className="bg-[#0a0a0f] border border-slate-800/80 rounded-[2.5rem] overflow-hidden">
           {isLoading ? (
             <div className="p-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing event database...</p>
             </div>
           ) : filtered.length === 0 ? (
             <div className="p-24 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center border border-slate-800">
                  <Calendar className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No event records found in this sector.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-800/50 bg-slate-900/20">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Identity</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dynamics</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/30">
                      {filtered.map((contest) => (
                        <tr key={contest.id} className="group hover:bg-blue-500/[0.02] transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex flex-col">
                                 <span className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic">{contest.title}</span>
                                 <span className="text-[10px] text-slate-500 font-bold tracking-tight mt-1 truncate max-w-[200px]">{contest.description}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <Badge className={`
                                 ${contest.status === 'ONGOING' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   contest.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                   'bg-slate-500/10 text-slate-500 border-slate-500/20'}
                              `}>
                                 {contest.status}
                              </Badge>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Users className="w-3.5 h-3.5" />
                                    {contest.participantCount}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Settings className="w-3.5 h-3.5" />
                                    {contest.totalProblems}
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Link href={`/admin/contests/${contest.id}/analytics`}>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800">
                                       <BarChart3 className="w-4 h-4" />
                                    </Button>
                                 </Link>
                                 <Link href={`/admin/contests/${contest.id}/edit`}>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10">
                                       <Edit2 className="w-4 h-4" />
                                    </Button>
                                 </Link>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(contest.id)}
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
