"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubmissionStatus, TestResult } from "@/features/submissions/types";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Code2,
    Cpu,
    Database,
    Loader2,
    XCircle
} from "lucide-react";

interface SubmissionStatusDisplayProps {
  status: SubmissionStatus;
  testCasesPassed?: number;
  totalTestCases?: number;
  executionTime?: number;
  memoryUsed?: number;
  errorMessage?: string;
  testResults?: TestResult[];
}

export function SubmissionStatusDisplay({
  status,
  testCasesPassed = 0,
  totalTestCases = 0,
  executionTime,
  memoryUsed,
  errorMessage,
  testResults
}: SubmissionStatusDisplayProps) {
  
  const isProcessing = status === "PENDING" || status === "QUEUED" || status === "PROCESSING";
  const isAccepted = status === "ACCEPTED";
  const isError = !isProcessing && !isAccepted;

  const getStatusColor = () => {
    if (isProcessing) return "text-blue-400";
    if (isAccepted) return "text-emerald-400";
    return "text-rose-400";
  };

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (isAccepted) return <CheckCircle2 className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const passRate = totalTestCases > 0 ? (testCasesPassed / totalTestCases) * 100 : 0;

  return (
    <Card className="p-4 bg-slate-900/50 border-slate-800 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={getStatusColor()}>{getStatusIcon()}</div>
          <div>
            <h3 className={`font-bold ${getStatusColor()}`}>
              {status.replace("_", " ")}
            </h3>
            <p className="text-xs text-slate-400">
              {isProcessing ? "Executing your code..." : `Completed at ${new Date().toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        
        {!isProcessing && (
          <div className="text-right">
            <span className="text-2xl font-black text-slate-100">
              {testCasesPassed}/{totalTestCases}
            </span>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Passed</p>
          </div>
        )}
      </div>

      {!isProcessing && totalTestCases > 0 && (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase text-slate-500 font-bold">
              <span>Test Case Progress</span>
              <span>{Math.round(passRate)}%</span>
            </div>
            <Progress value={passRate} className="h-1.5 bg-slate-800" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-950/50 border border-slate-800/50 flex flex-col items-center">
              <Clock className="w-3 h-3 text-slate-500 mb-1" />
              <span className="text-xs font-mono text-slate-200">{executionTime ?? "--"}ms</span>
              <span className="text-[9px] text-slate-500 uppercase">Time</span>
            </div>
            <div className="p-2 rounded bg-slate-950/50 border border-slate-800/50 flex flex-col items-center">
              <Database className="w-3 h-3 text-slate-500 mb-1" />
              <span className="text-xs font-mono text-slate-200">{memoryUsed ? Math.round(memoryUsed / 1024) : "--"}MB</span>
              <span className="text-[9px] text-slate-500 uppercase">Memory</span>
            </div>
            <div className="p-2 rounded bg-slate-950/50 border border-slate-800/50 flex flex-col items-center">
              <Cpu className="w-3 h-3 text-slate-500 mb-1" />
              <span className="text-xs font-mono text-slate-200">N/A</span>
              <span className="text-[9px] text-slate-500 uppercase">CPU</span>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 rounded bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <AlertCircle className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">Error Message</span>
          </div>
          <pre className="text-xs text-rose-200 break-words whitespace-pre-wrap font-mono leading-relaxed">
            {errorMessage}
          </pre>
        </div>
      )}

      {testResults && testResults.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Code2 className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">Test Case Details</span>
          </div>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
            {testResults.map((res, i) => (
              <div key={i} className="p-2 rounded bg-slate-950/30 border border-slate-800/50 flex items-center justify-between transition-colors hover:bg-slate-950/50">
                <span className="text-[10px] text-slate-400">Test Case #{i + 1}</span>
                <span className={`text-[10px] font-bold uppercase ${res.passed ? "text-emerald-500" : "text-rose-500"}`}>
                  {res.passed ? "Passed" : "Failed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
