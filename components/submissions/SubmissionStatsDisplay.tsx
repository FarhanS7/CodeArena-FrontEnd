'use client';

interface SubmissionStats {
  totalSubmissions: number;
  acceptedSubmissions: number;
  rejectedSubmissions: number;
  acceptanceRate: number;
  averageScore: number;
  languageBreakdown: { [language: string]: number };
  successRatio: number;
  totalTime: number;
  averageTimePerProblem: number;
}

interface SubmissionStatsDisplayProps {
  stats: SubmissionStats;
}

/**
 * SubmissionStatsDisplay Component - Show submission statistics
 */
export function SubmissionStatsDisplay({ stats }: SubmissionStatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Submissions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">Total Submissions</p>
        <p data-testid="stat-total-submissions" className="text-3xl font-bold text-gray-900">
          {stats.totalSubmissions}
        </p>
        <p className="text-xs text-gray-500 mt-1">All time submissions</p>
      </div>

      {/* Accepted Submissions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">Accepted</p>
        <p data-testid="stat-accepted" className="text-3xl font-bold text-green-600">
          {stats.acceptedSubmissions}
        </p>
        <p className="text-xs text-gray-500 mt-1">Successful solutions</p>
      </div>

      {/* Acceptance Rate */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">Acceptance Rate</p>
        <p data-testid="stat-acceptance-rate" className="text-3xl font-bold text-blue-600">
          {(stats.acceptanceRate * 100).toFixed(1)}%
        </p>
        <p className="text-xs text-gray-500 mt-1">Success percentage</p>
      </div>

      {/* Average Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">Average Score</p>
        <p data-testid="stat-avg-score" className="text-3xl font-bold text-purple-600">
          {stats.averageScore.toFixed(0)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Out of 100</p>
      </div>
    </div>
  );
}
