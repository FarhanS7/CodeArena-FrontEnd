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

interface UserRatingProgressProps {
  stats: Stats;
}

/**
 * UserRatingProgress Component - Displays rating progress bar
 * Shows current rating vs max rating with visual progress indicator
 */
export function UserRatingProgress({ stats }: UserRatingProgressProps) {
  const progressPercentage = (stats.rating / stats.maxRating) * 100;

  // Determine rating color based on level
  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return 'from-red-500 to-red-400';
    if (rating >= 1800) return 'from-purple-500 to-purple-400';
    if (rating >= 1600) return 'from-blue-500 to-blue-400';
    if (rating >= 1400) return 'from-green-500 to-green-400';
    if (rating >= 1200) return 'from-yellow-500 to-yellow-400';
    return 'from-gray-500 to-gray-400';
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2000) return 'Legendary';
    if (rating >= 1800) return 'Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Advanced';
    if (rating >= 1200) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Rating Progress</h3>

      <div className="space-y-4">
        {/* Rating Title and Numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Current Level</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${getRatingColor(stats.rating)} bg-clip-text text-transparent`}>
              {getRatingTitle(stats.rating)}
            </p>
          </div>
          <div className="text-right">
            <p data-testid="rating-text" className="text-lg font-bold text-slate-900">
              {stats.rating} / {stats.maxRating}
            </p>
            <p className="text-xs text-slate-500">
              {Math.round(progressPercentage)}% progress
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div
            data-testid="rating-progress-bar"
            className="w-full bg-slate-200 rounded-full h-3 overflow-hidden"
          >
            <div
              className={`h-full bg-gradient-to-r ${getRatingColor(stats.rating)} transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Level Markers */}
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>0</span>
            <span>{stats.maxRating}</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-500">Next Level</p>
            <p className="font-semibold text-slate-900">
              {Math.max(0, stats.maxRating - stats.rating)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Best Rating</p>
            <p className="font-semibold text-slate-900">{stats.maxRating}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Contests</p>
            <p className="font-semibold text-slate-900">{stats.contestsParticipated}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
