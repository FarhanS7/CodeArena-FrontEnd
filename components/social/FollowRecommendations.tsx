'use client';

import { Star, X } from 'lucide-react';

interface FollowSuggestion {
  id: number;
  username: string;
  rating: number;
  problemsSolved: number;
  reason: string;
  avatar?: string;
}

interface FollowRecommendationsProps {
  suggestions: FollowSuggestion[];
  onFollow: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function FollowRecommendations({
  suggestions,
  onFollow,
  onDismiss,
}: FollowRecommendationsProps) {
  return (
    <div data-testid="follow-suggestions-section" className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Recommended to Follow
      </h3>

      <div className="grid gap-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{suggestion.username}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{suggestion.rating}</span> rating ·{' '}
                  <span className="font-medium">{suggestion.problemsSolved}</span> problems solved
                </p>
              </div>
              <button
                onClick={() => onDismiss(suggestion.id)}
                data-testid="dismiss-suggestion"
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">{suggestion.reason}</p>

            <button
              onClick={() => onFollow(suggestion.id)}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
          No recommendations available
        </div>
      )}
    </div>
  );
}
