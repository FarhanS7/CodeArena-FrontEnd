"use client";

import { Contest } from "@/features/contests/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Calendar, 
    Clock, 
    Globe, 
    Lock, 
    ShieldCheck, 
    Trophy,
    Save,
    ChevronLeft
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ContestFormProps {
  initialData?: Partial<Contest>;
  onSubmit: (data: Partial<Contest>) => Promise<void>;
  isLoading: boolean;
  title: string;
}

export function ContestForm({ initialData, onSubmit, isLoading, title }: ContestFormProps) {
  const [formData, setFormData] = useState<Partial<Contest>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    startTime: initialData?.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : "",
    endTime: initialData?.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : "",
    status: initialData?.status || "UPCOMING",
    isPublic: initialData?.isPublic ?? true,
    difficulty: initialData?.difficulty || "MEDIUM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <Link href="/admin/contests" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 group">
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Back to Registry
            </Link>
            <h1 className="text-3xl font-black italic uppercase text-white">{title}</h1>
         </div>
         <Button 
           type="submit" 
           isLoading={isLoading}
           className="h-12 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-xl shadow-blue-500/20 gap-3"
         >
            <Save className="w-5 h-5" />
            Commit Sequence
         </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Left: General Info */}
         <div className="lg:col-span-2 space-y-8">
            <div className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/80 space-y-8 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Identity Configuration</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Designation</label>
                     <Input 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Operation: Binary Blitz"
                        className="bg-slate-950/50 border-slate-800 h-14 rounded-2xl focus:ring-blue-500/20"
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission briefing</label>
                     <Textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail the objectives and protocols..."
                        className="bg-slate-950/50 border-slate-800 min-h-[200px] rounded-2xl focus:ring-blue-500/20 p-6"
                        required
                     />
                  </div>
               </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/80 space-y-8 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Temporal Synchronization</h3>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-emerald-500">Commencement</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                           type="datetime-local"
                           value={formData.startTime}
                           onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                           className="bg-slate-950/50 border-slate-800 h-14 pl-12 rounded-2xl focus:ring-emerald-500/20"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-rose-500">Termination</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                           type="datetime-local"
                           value={formData.endTime}
                           onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                           className="bg-slate-950/50 border-slate-800 h-14 pl-12 rounded-2xl focus:ring-rose-500/20"
                           required
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Settings */}
         <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 space-y-8">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Protocol Settings</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Complexity Level</label>
                     <select 
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                        className="w-full bg-slate-950 border-slate-800 h-14 rounded-2xl px-4 text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none italic font-bold"
                     >
                        <option value="EASY">EASY ALPHA</option>
                        <option value="MEDIUM">MEDIUM BRAVO</option>
                        <option value="HARD">HARD CHARLIE</option>
                        <option value="MIXED">MIXED DELTA</option>
                     </select>
                  </div>

                  <div className="pt-4 flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                     <div className="flex items-center gap-3">
                        {formData.isPublic ? <Globe className="w-4 h-4 text-blue-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                        <span className="text-xs font-bold text-slate-300 uppercase italic">{formData.isPublic ? "Public Access" : "Restricted Node"}</span>
                     </div>
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublic ? 'bg-blue-600' : 'bg-slate-800'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPublic ? 'left-7' : 'left-1'}`} />
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/10 border border-slate-800/50 border-dashed text-center space-y-4">
               <p className="text-[10px] text-slate-600 font-bold uppercase leading-relaxed italic">
                  Note: Problems must be associated with the contest after initialization is complete via the management dashboard.
               </p>
            </div>
         </div>
      </div>
    </form>
  );
}
