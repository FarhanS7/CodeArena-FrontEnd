interface Stats {
  problemsSolved: number;
  submissionAccepted: number;
  submissionTotal: number;
  contestsParticipated: number;
  rating: number;
  maxRating: number;
  acceptanceRate: number;
  averageTime: number;
  globalRank: number;
  totalUsers: number;
  percentile: number;
}

interface UserSubmissionStatsProps {
  stats: Stats;
}

/**
 * UserSubmissionStats Component - Displays submission statistics
 * Shows accepted vs total submissions with visual breakdown
 */
export function UserSubmissionStats({ stats }: UserSubmissionStatsProps) {
  const rejectedCount = stats.submissionTotal - stats.submissionAccepted;
  const acceptedPercentage = (stats.submissionAccepted / stats.submissionTotal) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Submission Statistics</h3>

      <div data-testid="submission-stats" className="space-y-6">
        {/* Accepted vs Total */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Accepted Submissions</span>
            <span data-testid="accepted-count" className="font-bold text-green-600">
              {stats.submissionAccepted}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${acceptedPercentage}%` }} />
          </div>
        </div>

        {/* Total Submissions */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total Submissions</span>
            <span data-testid="total-submissions" className="font-bold text-slate-900">
              {stats.submissionTotal}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
          <div className="bg-green-50 rounded p-3">
            <p className="text-xs text-slate-600 mb-1">Accepted</p>
            <p className="text-lg font-bold text-green-600">{stats.submissionAccepted}</p>
          </div>
          <div className="bg-red-50 rounded p-3">
            <p className="text-xs text-slate-600 mb-1">Rejected</p>
            <p className="text-lg font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        {/* Average Time */}
        <div className="bg-blue-50 rounded p-3">
          <p className="text-xs text-slate-600 mb-1">Average Solve Time</p>
          <p className="text-lg font-bold text-blue-600">{stats.averageTime}s</p>
        </div>
      </div>
    </div>
  );
}
