"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { fetchAllComments } from "@/features/discussions/api";
import { Comment } from "@/features/discussions/types";
import { 
    AlertCircle, 
    Filter, 
    Loader2, 
    MessageSquare, 
    Search, 
    TrendingUp 
} from "lucide-react";
import { useEffect, useState } from "react";
import { CommentItem } from "@/components/problems/CommentItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GlobalDiscussionPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllComments();
        // For global view, we might only want to show root comments or a hybrid feed
        setComments(data.filter(c => !c.parent));
      } catch (err) {
        console.error("Failed to load global discussions:", err);
        setError("Could not load the discussion feed.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
            <MessageSquare className="w-3 h-3" />
            Arena Discussions
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            The <span className="text-emerald-500 italic">Nexus</span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            A central hub for architects, problem solvers, and dreamers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-10 bg-slate-900/50 border-slate-800 focus:ring-emerald-500/20 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 bg-slate-900 border-slate-800 text-slate-400">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-500 font-medium">Connecting to the Nexus...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-slate-400">{error}</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-slate-800 mx-auto" />
              <p className="text-slate-500">No transmissions found in this sector.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="group transition-all">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800/50 group-hover:border-emerald-500/20 transition-colors">
                        Problem #{comment.problemId}
                      </div>
                   </div>
                   <CommentItem 
                     comment={comment} 
                     currentUserId={user?.id}
                     onDelete={async (id) => {
                       if (confirm("Clear this transmission?")) {
                          // import { deleteComment } from "@/features/discussions/api";
                          // await deleteComment(id);
                       }
                     }}
                     onReply={async (content, parentId) => {
                        toast.info("Transmitting reply...");
                     }}
                   />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
              <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" />
                Trending Topics
              </div>
              <div className="space-y-4">
                 {["Dynamic Programming", "LRU Cache Optimization", "Time Complexity Analysis"].map((topic, i) => (
                   <div key={topic} className="flex flex-col gap-1 cursor-pointer group">
                      <span className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">{topic}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">1{i} discussions today</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-6">
              <h3 className="text-xl font-bold text-white">Share Your Logic</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Found an elegant solution? Help others by explaining your approach.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 rounded-2xl shadow-xl shadow-emerald-900/20">
                Go to Problems
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
