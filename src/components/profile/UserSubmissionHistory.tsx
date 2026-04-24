'use client';

import { useMemo } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
  id: string;
  problemId: number;
  problemTitle: string;
  status: string;
  language: string;
  submittedAt: string;
  score: number;
}

interface UserSubmissionHistoryProps {
  submissions: Submission[];
  statusFilter: string;
  sortBy: string;
  onStatusFilterChange: (status: string) => void;
  onSortChange: (sort: string) => void;
}

/**
 * UserSubmissionHistory Component - Displays user's submission history
 * Supports filtering by status and sorting by date/score
 */
export function UserSubmissionHistory({
  submissions,
  statusFilter,
  sortBy,
  onStatusFilterChange,
  onSortChange,
}: UserSubmissionHistoryProps) {
  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'ALL') return submissions;
    return submissions.filter((sub) => sub.status === statusFilter);
  }, [submissions, statusFilter]);

  // Sort submissions
  const sortedSubmissions = useMemo(() => {
    const sorted = [...filteredSubmissions];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } else if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    }
    return sorted;
  }, [filteredSubmissions, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'WRONG_ANSWER':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'TIME_LIMIT':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'WRONG_ANSWER':
        return 'bg-red-100 text-red-800';
      case 'TIME_LIMIT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
              Status:
            </label>
            <select
              id="status-filter"
              data-testid="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WRONG_ANSWER">Wrong Answer</option>
              <option value="TIME_LIMIT">Time Limit</option>
              <option value="RUNTIME_ERROR">Runtime Error</option>
              <option value="COMPILATION_ERROR">Compilation Error</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-selector" className="text-sm font-medium text-slate-700">
              Sort by:
            </label>
            <select
              id="sort-selector"
              data-testid="sort-selector"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date (Newest)</option>
              <option value="score">Score (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {sortedSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-slate-500">No submissions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Problem</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Language</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubmissions.map((submission) => (
                <tr
                  key={submission.id}
                  data-testid="submission-row"
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className="font-medium text-slate-900">{submission.problemTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(submission.status)}`}>
                      {submission.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{submission.language}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${submission.score === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {submission.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
