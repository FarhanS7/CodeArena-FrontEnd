'use client';

import { useMemo } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Contest {
  id: number;
  title: string;
  rank: number;
  score: number;
  participantCount: number;
  ratingChange: number;
  date: string;
}

interface RatingHistoryPoint {
  date: string;
  rating: number;
}

interface UserContestHistoryProps {
  contests: Contest[];
  ratingHistory: RatingHistoryPoint[];
}

/**
 * UserContestHistory Component - Displays user's contest participation
 * Shows contest results with ranking and rating changes
 */
export function UserContestHistory({
  contests,
  ratingHistory,
}: UserContestHistoryProps) {
  // Sort contests by date (newest first)
  const sortedContests = useMemo(() => {
    return [...contests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contests]);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'; // Gold
    if (rank === 2) return 'text-gray-400'; // Silver
    if (rank === 3) return 'text-orange-400'; // Bronze
    return 'text-slate-600';
  };

  const calculateMinMaxRating = () => {
    if (ratingHistory.length === 0) return { min: 0, max: 0 };
    const ratings = ratingHistory.map((h) => h.rating);
    return {
      min: Math.min(...ratings),
      max: Math.max(...ratings),
    };
  };

  const { min, max } = calculateMinMaxRating();
  const ratingRange = max - min || 1;

  return (
    <div className="space-y-6">
      {/* Contest History Table */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Contests</h3>

        {sortedContests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-500">No contest participation yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Contest</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Participants</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rating Change</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedContests.map((contest) => (
                  <tr
                    key={contest.id}
                    data-testid="contest-row"
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Trophy className={`w-4 h-4 ${getMedalColor(contest.rank)}`} />
                        <span className="font-medium text-slate-900">{contest.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">#{contest.rank}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{contest.score}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{contest.participantCount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          contest.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        {contest.ratingChange > 0 ? '+' : ''}
                        {contest.ratingChange}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDistanceToNow(new Date(contest.date), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rating Graph */}
      {ratingHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 data-testid="rating-graph" className="text-lg font-semibold text-slate-900 mb-4">
            Rating Progress
          </h3>

          {/* Simple line graph visualization */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Current</p>
                <p className="text-xl font-bold text-blue-600">
                  {ratingHistory[ratingHistory.length - 1]?.rating || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Highest</p>
                <p className="text-xl font-bold text-green-600">{max}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Lowest</p>
                <p className="text-xl font-bold text-orange-600">{min}</p>
              </div>
            </div>

            {/* Graph */}
            <div className="mt-6 h-32 bg-gradient-to-t from-blue-50 rounded p-4 overflow-x-auto">
              <div className="flex items-end justify-between gap-2 h-24" style={{ minWidth: '100%' }}>
                {ratingHistory.map((point, index) => {
                  const normalizedHeight = ((point.rating - min) / ratingRange) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${Math.max(5, normalizedHeight)}%` }}
                      title={`${point.rating} (${new Date(point.date).toLocaleDateString()})`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Date range */}
            <div className="flex justify-between text-xs text-slate-500 px-1">
              <span>{new Date(ratingHistory[0].date).toLocaleDateString()}</span>
              <span>{new Date(ratingHistory[ratingHistory.length - 1].date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
