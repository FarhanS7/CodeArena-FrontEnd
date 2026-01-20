"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export function CommentInput({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  buttonText = "Comment",
  autoFocus = false 
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] bg-slate-900 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50 resize-none"
        autoFocus={autoFocus}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !content.trim()}
          className="bg-amber-600 hover:bg-amber-500 text-white gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
