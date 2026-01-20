"use client";

import { Button } from "@/components/ui/button";
import { Comment } from "@/features/discussions/types";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { CommentInput } from "./CommentInput";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete: (id: string) => Promise<void>;
  onReply: (content: string, parentId: string) => Promise<void>;
}

export function CommentItem({ comment, currentUserId, onDelete, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const isOwner = currentUserId === comment.userId;

  const handleReplySubmit = async (content: string) => {
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  return (
    <div className="group space-y-4">
      <div className="flex gap-4">
        {/* Avatar Placeholder */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold uppercase">
          {comment.username.substring(0, 2)}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">{comment.username}</span>
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(comment.id)}
                  className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsReplying(!isReplying)}
              className="h-7 px-2 text-xs text-slate-500 hover:text-amber-400 gap-1.5"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-slate-800">
              <CommentInput 
                onSubmit={handleReplySubmit} 
                placeholder={`Reply to @${comment.username}...`}
                buttonText="Reply"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-14 space-y-6 border-l border-slate-800 ml-5 pt-2">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              currentUserId={currentUserId}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
