'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Send } from 'lucide-react';

interface SubmissionFormProps {
  code: string;
  language: string;
  contestId?: string;
  problemId?: string;
  onRun?: (data: {
    executionType: 'RUN';
    code: string;
    language: string;
  }) => Promise<void>;
  onSubmit?: (data: {
    executionType: 'SUBMIT';
    code: string;
    language: string;
    contestId: string;
    problemId: string;
  }) => Promise<void>;
  onLanguageChange?: (language: string) => void;
}

/**
 * Submission Form - RUN and SUBMIT buttons
 * RUN: executes against example test cases only
 * SUBMIT: full submission to contest with penalty calculation
 */
export function SubmissionForm({
  code,
  language,
  contestId,
  problemId,
  onRun,
  onSubmit,
  onLanguageChange,
}: SubmissionFormProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isCodeEmpty = !code || code.trim().length === 0;

  const handleRun = async () => {
    if (isCodeEmpty || !onRun) return;

    setIsRunning(true);
    try {
      await onRun({
        executionType: 'RUN',
        code,
        language,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isCodeEmpty || !onSubmit || !contestId || !problemId) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        executionType: 'SUBMIT',
        code,
        language,
        contestId,
        problemId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Language Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-white hover:border-slate-600 focus:outline-none focus:border-emerald-500"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="csharp">C#</option>
          <option value="golang">Go</option>
          <option value="rust">Rust</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          data-testid="run-button"
          onClick={handleRun}
          disabled={isCodeEmpty || isRunning}
          className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Run on Examples
        </Button>

        <Button
          data-testid="submit-button"
          onClick={handleSubmit}
          disabled={isCodeEmpty || isSubmitting}
          className="h-10 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Submit Solution
        </Button>
      </div>

      {/* Info Message */}
      {isCodeEmpty && (
        <div className="text-xs text-slate-400 italic">
          Write some code to enable submission
        </div>
      )}
    </div>
  );
}
