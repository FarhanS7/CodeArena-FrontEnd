"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchAiHint } from "@/features/ai/api";
import { Loader2, MessageSquare, Sparkles, X } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface AiHintPanelProps {
  problemId: number;
  code: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AiHintPanel({ problemId, code, language, isOpen, onClose }: AiHintPanelProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetHint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAiHint({ problemId, code, language });
      setHint(result);
    } catch (err: any) {
      console.error("Failed to fetch AI hint:", err);
      setError("Failed to generate hint. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-slate-100">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {!hint && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-200">Need a nudge?</h3>
              <p className="text-sm text-slate-400 px-4">
                Our AI can analyze your current code and provide a subtle hint without giving away the full solution.
              </p>
            </div>
            <Button 
              onClick={handleGetHint} 
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Hint
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Analyzing your logic...</p>
          </div>
        )}

        {hint && !isLoading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
              <MessageSquare className="w-3 h-3" />
              Suggested Hint
            </div>
            <Card className="p-4 bg-slate-900/50 border-slate-800 prose prose-invert prose-sm max-w-none shadow-inner">
              <ReactMarkdown>{hint}</ReactMarkdown>
            </Card>
            <div className="pt-4 flex justify-center">
               <Button 
                variant="outline"
                size="sm"
                onClick={handleGetHint} 
                className="text-xs border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 gap-2"
              >
                <Sparkles className="w-3 h-3" />
                Try another hint
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
            <p className="text-xs text-rose-400 font-medium">{error}</p>
            <Button variant="outline" size="sm" onClick={handleGetHint} className="text-[10px] uppercase font-bold">
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Footer / Context */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Connected to Gemini 1.5 Flash
        </div>
      </div>
    </div>
  );
}
