"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { createComment, deleteComment, fetchComments } from "@/features/discussions/api";
import { Comment } from "@/features/discussions/types";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  problemId: number;
}

export function CommentSection({ problemId }: CommentSectionProps) {
  const { user } = useAuth(); // Need to verify if this exists, otherwise I'll need to adapt
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchComments(problemId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Could not load discussions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [problemId]);

  // Filter out replies from the top level to avoid duplicates
  // This assumes the backend returns a flat list including replies
  const rootComments = useMemo(() => {
    return comments.filter(c => !c.parent); 
  }, [comments]);

  const handleCreateComment = async (content: string, parentId?: string) => {
    if (!user) {
      toast.error("Please login to participate in the discussion.");
      return;
    }

    try {
      const newComment = await createComment({
        problemId,
        content,
        parent: parentId ? { id: parentId } : undefined,
        userId: user.id,
        username: user.username,
      } as any);
      
      // Refresh comments to get the updated tree
      // In a real app, we might want to optimistically update or append
      await loadComments();
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Discussion Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Discussions</h2>
          <p className="text-xs text-slate-500">{comments.length} total comments</p>
        </div>
      </div>

      {/* Main Comment Input */}
      <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
        <CommentInput onSubmit={(content) => handleCreateComment(content)} />
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Fetching messages...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500" />
          <p className="text-slate-400 max-w-xs">{error}</p>
        </div>
      )}

      {/* No Comments State */}
      {!isLoading && !error && rootComments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-slate-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-300">No discussions yet</h3>
            <p className="text-sm text-slate-500 px-10">
              Be the first to share your approach or ask a question about this problem.
            </p>
          </div>
        </div>
      )}

      {/* Comment List */}
      {!isLoading && !error && rootComments.length > 0 && (
        <div className="space-y-10 divide-y divide-slate-800/50">
          {rootComments.map((comment) => (
            <div key={comment.id} className="pt-8 first:pt-0">
              <CommentItem 
                comment={comment} 
                currentUserId={user?.id}
                onDelete={handleDeleteComment}
                onReply={(content, pid) => handleCreateComment(content, pid)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
