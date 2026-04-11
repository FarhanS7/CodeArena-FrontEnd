'use client';

import { TrendingUp } from 'lucide-react';

interface SearchStats {
  totalSearches: number;
  averageSearchTime: number;
  mostSearched: string;
  trendingSearches: string[];
}

interface SearchStatsProps {
  stats: SearchStats;
  isOpen: boolean;
}

export function SearchStats({ stats, isOpen }: SearchStatsProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="stats-panel"
      className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-4"
    >
      <h3 className="text-lg font-semibold">Search Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Searches</p>
          <p className="text-2xl font-bold">{stats.totalSearches}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600">Avg Time</p>
          <p className="text-2xl font-bold">{stats.averageSearchTime.toFixed(2)}s</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Most Searched</p>
        <p className="text-lg text-blue-600">{stats.mostSearched}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Trending Now
        </h4>
        <div className="space-y-1">
          {stats.trendingSearches.map((search) => (
            <p key={search} className="text-sm text-gray-700">
              • {search}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
