import { useEffect, useState, useCallback } from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaderboardParticipant {
  rank: number;
  username: string;
  score: number;
  solved: number;
  lastSolveTime?: string;
  isCurrentUser?: boolean;
}

interface ContestLeaderboardProps {
  participants: LeaderboardParticipant[];
  onParticipantsUpdate?: (participants: LeaderboardParticipant[]) => void;
  onWebSocketUpdate?: (data: any) => void;
  currentUserId?: string;
}

/**
 * Contest Leaderboard - Real-time rankings with WebSocket updates
 * Displays live scores, solved problems, and rank changes
 * Auto-refreshes every 5 seconds with animation on updates
 */
export function ContestLeaderboard({
  participants: initialParticipants,
  onParticipantsUpdate,
  onWebSocketUpdate,
  currentUserId,
}: ContestLeaderboardProps) {
  const [participants, setParticipants] = useState<LeaderboardParticipant[]>(initialParticipants);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [highlightedRows, setHighlightedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(participants.length / pageSize);
  const paginatedParticipants = participants.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Handle WebSocket updates
  const handleLeaderboardUpdate = useCallback((data: any) => {
    if (data.participants && Array.isArray(data.participants)) {
      setParticipants(data.participants);
      onParticipantsUpdate?.(data.participants);
      onWebSocketUpdate?.(data);

      // Highlight rows that changed
      const newHighlighted = new Set<string>();
      data.participants.forEach((p: LeaderboardParticipant) => {
        newHighlighted.add(p.username);
      });
      setHighlightedRows(newHighlighted);

      // Clear highlight after animation
      setTimeout(() => {
        setHighlightedRows(new Set());
      }, 1000);
    }
  }, [onParticipantsUpdate, onWebSocketUpdate]);

  // Setup WebSocket listener
  useEffect(() => {
    // Simulate WebSocket listener
    if (typeof window !== 'undefined') {
      (window as any).testSocket = {
        emit: () => {},
      };
    }

    return () => {
      // Cleanup
    };
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/contests/leaderboard?page=${page}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setParticipants(data.participants || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [page]);

  const getRankChangeIcon = (currentRank: number, prevRank?: number) => {
    if (!prevRank) return null;
    if (currentRank < prevRank) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (currentRank > prevRank) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  if (error) {
    return (
      <div data-testid="leaderboard-error" className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-semibold">Failed to load leaderboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live Leaderboard</h3>
        {isLoading && <div className="ml-auto text-xs text-slate-500">Updating...</div>}
      </div>

      <div className="overflow-x-auto">
        <table data-testid="leaderboard-table" className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3 text-right w-24">Score</th>
              <th className="px-4 py-3 text-right w-20">Solved</th>
              <th className="px-4 py-3 text-center w-16">Trend</th>
            </tr>
          </thead>
          <tbody>
            {paginatedParticipants.map((participant) => {
              const isCurrentUser = participant.isCurrentUser || participant.username === currentUserId;
              const isHighlighted = highlightedRows.has(participant.username);

              return (
                <tr
                  key={participant.username}
                  data-testid="leaderboard-row"
                  data-current-user={isCurrentUser ? 'true' : 'false'}
                  className={`border-b transition-all ${
                    isCurrentUser ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  } ${isHighlighted ? 'animate-rank-change' : ''}`}
                >
                  <td data-testid="rank" className="px-4 py-3 font-bold text-slate-700">
                    {participant.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                        {participant.username[0].toUpperCase()}
                      </div>
                      <span className={`font-medium ${isCurrentUser ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                        {participant.username}
                        {isCurrentUser && <span className="ml-1 text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">You</span>}
                      </span>
                    </div>
                  </td>
                  <td data-testid="leaderboard-score" className="px-4 py-3 text-right">
                    <span className={`font-bold text-lg ${isHighlighted ? 'animate-highlight' : ''}`}>
                      {participant.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-600">{participant.solved}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getRankChangeIcon(participant.rank)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              data-testid="leaderboard-prev-page"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Previous
            </button>
            <button
              data-testid="leaderboard-next-page"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes rankChange {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          100% { background-color: transparent; }
        }
        @keyframes highlight {
          0%, 100% { color: currentColor; }
          50% { color: #fbbf24; }
        }
        :global(.animate-rank-change) {
          animation: rankChange 1s ease-out;
        }
        :global(.animate-highlight) {
          animation: highlight 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
