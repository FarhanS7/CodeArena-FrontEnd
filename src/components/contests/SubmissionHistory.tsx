import { useEffect } from 'react';

interface Submission {
  id: string;
  status: string;
  language?: string;
  submittedAt?: Date | string;
  time?: string;
  problemLabel?: string;
  score?: number;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
  onRefresh?: () => void;
  onSubmissionClick?: (submission: Submission) => void;
}

/**
 * Submission History - Recent submission tracking
 * Displays submissions sorted by most recent first
 * Auto-refreshes every 5 seconds
 */
export function SubmissionHistory({
  submissions,
  onRefresh,
  onSubmissionClick,
}: SubmissionHistoryProps) {
  useEffect(() => {
    if (!onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  // Sort by most recent first
  const sorted = [...submissions].sort((a, b) => {
    const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : new Date(a.time || 0).getTime();
    const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : new Date(b.time || 0).getTime();
    return bTime - aTime;
  });

  if (sorted.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center py-8 text-gray-500">
        <p className="text-sm">No submissions yet</p>
        <p className="text-xs text-gray-400">Your submissions will appear here</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'WRONG_ANSWER':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return 'bg-red-100 text-red-800';
      case 'TIME_LIMIT_EXCEEDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeString = (sub: Submission) => {
    if (sub.submittedAt) {
      return new Date(sub.submittedAt).toLocaleTimeString();
    }
    if (sub.time) {
      return new Date(sub.time).toLocaleTimeString();
    }
    return 'N/A';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Language</th>
            <th className="px-4 py-3">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((sub) => (
            <tr
              key={sub.id}
              data-testid="submission-row"
              onClick={() => onSubmissionClick?.(sub)}
              className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">
                {sub.language || 'N/A'}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {getTimeString(sub)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
