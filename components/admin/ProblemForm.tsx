"use client";

import { AdminProblem } from "@/features/problems/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Plus, 
    Trash2, 
    Save, 
    ChevronLeft, 
    Code2, 
    Beaker,
    Info,
    AlertTriangle
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ProblemFormProps {
  initialData?: Partial<AdminProblem>;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  title: string;
}

export function ProblemForm({ initialData, onSubmit, isLoading, title }: ProblemFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    difficulty: initialData?.difficulty || "MEDIUM",
    description: initialData?.description || "",
    exampleInput: initialData?.exampleInput || "",
    exampleOutput: initialData?.exampleOutput || "",
    testCases: initialData?.testCases || [{ input: "", expectedOutput: "" }],
  });

  const handleAddTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", expectedOutput: "" }],
    });
  };

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleTestCaseChange = (index: number, field: string, value: string) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <Link href="/admin/problems" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 group">
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Back to Inventory
            </Link>
            <h1 className="text-3xl font-black italic uppercase text-white">{title}</h1>
         </div>
         <Button 
           type="submit" 
           isLoading={isLoading}
           className="h-12 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl shadow-emerald-500/20 gap-3"
         >
            <Save className="w-5 h-5" />
            Forge Module
         </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Left: General Info */}
         <div className="lg:col-span-2 space-y-12">
            <section className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/80 space-y-8 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Base Parameters</h3>
               </div>
               
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Module Designation</label>
                     <Input 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Recursive Descent Parser"
                        className="bg-slate-950/50 border-slate-800 h-14 rounded-2xl focus:ring-emerald-500/20"
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Complexity Class</label>
                     <select 
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                        className="w-full bg-slate-950 border-slate-800 h-14 rounded-2xl px-4 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none italic font-bold"
                     >
                        <option value="EASY">EASY ALPHA</option>
                        <option value="MEDIUM">MEDIUM BRAVO</option>
                        <option value="HARD">HARD CHARLIE</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logic Definition (Markdown)</label>
                  <Textarea 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Define the problem objective and constraints..."
                     className="bg-slate-950/50 border-slate-800 min-h-[300px] rounded-2xl focus:ring-emerald-500/20 p-6 font-mono"
                     required
                  />
               </div>
            </section>

            <section className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/80 space-y-8 backdrop-blur-sm">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Beaker className="w-5 h-5 text-purple-500" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Validation Sequences (Test Cases)</h3>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddTestCase}
                    variant="outline"
                    className="h-10 border-slate-800 bg-slate-900/50 text-xs font-bold gap-2 rounded-xl"
                  >
                     <Plus className="w-3.5 h-3.5" />
                     Add Sequence
                  </Button>
               </div>

               <div className="space-y-6">
                  {formData.testCases.map((tc, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-950/50 border border-slate-800 relative group">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Input Stream {index + 1}</label>
                           <Textarea 
                              value={tc.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                              className="bg-black/40 border-slate-800 rounded-xl min-h-[100px] text-xs font-mono"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expected Output</label>
                           <Textarea 
                              value={tc.expectedOutput}
                              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                              className="bg-black/40 border-slate-800 rounded-xl min-h-[100px] text-xs font-mono"
                              required
                           />
                        </div>
                        {formData.testCases.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveTestCase(index)}
                            className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-500 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Right: Meta & Tips */}
         <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 space-y-8 sticky top-8">
               <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Public Examples</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Example Input</label>
                     <Input 
                        value={formData.exampleInput}
                        onChange={(e) => setFormData({...formData, exampleInput: e.target.value})}
                        className="bg-slate-950/50 border-slate-800 h-14 rounded-2xl focus:ring-blue-500/20"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Example Output</label>
                     <Input 
                        value={formData.exampleOutput}
                        onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
                        className="bg-slate-950/50 border-slate-800 h-14 rounded-2xl focus:ring-blue-500/20"
                     />
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-800/50 space-y-4">
                  <div className="flex gap-3 text-amber-500/80">
                     <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                     <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">
                        Warning: All test cases must follow absolute formatting. Extra whitespace or hidden characters will cause rejection.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </form>
  );
}
