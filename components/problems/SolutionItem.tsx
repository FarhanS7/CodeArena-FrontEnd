"use client";

import { Submission } from "@/features/submissions/types";
import { 
    Calendar, 
    Code2, 
    ExternalLink, 
    User, 
    Zap,
    Clock,
    Database
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SolutionItemProps {
  solution: Submission;
}

export function SolutionItem({ solution }: SolutionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-slate-900/40 border-slate-800/50 hover:border-slate-700/50 transition-all overflow-hidden group">
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">{solution.username || "Anonymous Hero"}</span>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                {solution.language}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3 h-3 text-slate-600" />
                {formatDistanceToNow(new Date(solution.createdAt))} ago
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500/80 uppercase">
                    <Clock className="w-3 h-3" />
                    {solution.executionTime}ms
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500/80 uppercase">
                    <Database className="w-3 h-3" />
                    {(solution.memoryUsed ? solution.memoryUsed / 1024 : 0).toFixed(1)}MB
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 bg-slate-800 border-slate-700 hover:bg-slate-700 text-xs font-bold gap-2 px-4"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            {isExpanded ? "Hide Logic" : "View Logic"}
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800/50 p-6 bg-slate-950 animate-in slide-in-from-top-2 duration-300">
          <div className="rounded-xl overflow-hidden border border-slate-800">
            <SyntaxHighlighter
              language={solution.language.toLowerCase()}
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                fontSize: '0.85rem',
                backgroundColor: '#0A0A0A',
                fontFamily: 'var(--font-mono)',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'inherit',
                }
              }}
            >
              {solution.sourceCode}
            </SyntaxHighlighter>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] px-2">
            <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" />
                Verified Accepted Solution
            </div>
            <div>
                {solution.testCasesPassed} / {solution.totalTestCases} Test Cases Passed
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
