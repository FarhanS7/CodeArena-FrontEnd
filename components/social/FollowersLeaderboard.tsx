'use client';

import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  followerCount: number;
  rating?: number;
  isCurrentUser?: boolean;
}

interface FollowersLeaderboardProps {
  entries: LeaderboardEntry[];
  onUserClick: (username: string) => void;
}

export function FollowersLeaderboard({ entries, onUserClick }: FollowersLeaderboardProps) {
  return (
    <div data-testid="followers-leaderboard" className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Top Followers
      </h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Followers</th>
              {entries[0]?.rating && (
                <th className="px-4 py-3 text-right text-sm font-semibold">Rating</th>
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.rank}
                data-testid={`leaderboard-row-${entry.username}`}
                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition ${
                  entry.isCurrentUser ? 'bg-blue-50' : ''
                }`}
                onClick={() => onUserClick(entry.username)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    {entry.rank === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                    {entry.rank === 3 && <Trophy className="w-5 h-5 text-orange-600" />}
                    <span className="font-bold">#{entry.rank}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.username}</span>
                    {entry.isCurrentUser && (
                      <span
                        data-testid="current-user-badge"
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold">{entry.followerCount.toLocaleString()}</span>
                </td>
                {entry.rating && (
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-blue-600">{entry.rating}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
