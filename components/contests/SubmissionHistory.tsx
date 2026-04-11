'use client';

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

interface Submission {
  id?: string;
  problemLabel: string;
  status: string;
  time: string;
  score?: number;
  language?: string;
  submittedAt?: string;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
  onSubmissionClick?: (submission: Submission) => void;
}

const statusIcons: Record<string, React.ReactNode> = {
  ACCEPTED: <CheckCircle className="w-4 h-4 text-green-500" />,
  WRONG_ANSWER: <XCircle className="w-4 h-4 text-red-500" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-500 animate-spin" />,
  COMPILATION_ERROR: <AlertCircle className="w-4 h-4 text-red-700" />,
  RUNTIME_ERROR: <AlertCircle className="w-4 h-4 text-orange-500" />,
  TIME_LIMIT_EXCEEDED: <Clock className="w-4 h-4 text-purple-500" />,
};

const statusColors: Record<string, string> = {
  ACCEPTED: 'text-green-500',
  WRONG_ANSWER: 'text-red-500',
  PENDING: 'text-yellow-500',
  COMPILATION_ERROR: 'text-red-700',
  RUNTIME_ERROR: 'text-orange-500',
  TIME_LIMIT_EXCEEDED: 'text-purple-500',
};

export function SubmissionHistory({
  submissions,
  onSubmissionClick,
}: SubmissionHistoryProps) {
  // Sort submissions by most recent first
  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => {
      const timeA = new Date(b.time || b.submittedAt || 0).getTime();
      const timeB = new Date(a.time || a.submittedAt || 0).getTime();
      return timeA - timeB;
    });
  }, [submissions]);

  if (submissions.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <Clock className="w-12 h-12 text-slate-700 mb-3" />
        <p className="text-slate-400 font-semibold">No submissions yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Run or submit code to see your submission history
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        Submission History
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {sortedSubmissions.map((submission, idx) => (
          <div
            key={submission.id || idx}
            data-testid="submission-row"
            onClick={() => onSubmissionClick?.(submission)}
            className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                {statusIcons[submission.status] || (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {submission.problemLabel}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(
                      submission.time || submission.submittedAt || 0
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`text-xs font-semibold ${statusColors[submission.status] || 'text-slate-500'}`}>
                  {submission.status}
                </div>
                {submission.score !== undefined && (
                  <div className="text-sm font-bold text-emerald-500 tabular-nums w-12 text-right">
                    +{submission.score}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
