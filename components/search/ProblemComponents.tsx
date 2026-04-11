'use client';

import React from 'react';
import { Heart, Tag, TrendingUp, BookmarkPlus, Bookmark } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  acceptanceRate: number;
  submissions: number;
  tags: string[];
  rating?: number;
  isSaved?: boolean;
  status?: 'SOLVED' | 'ATTEMPTED' | 'UNSEEN';
}

interface ProblemCardProps {
  problem: Problem;
  onViewDetails: (id: number) => void;
  onSave?: (id: number) => void;
}

const difficultyColors: { [key: string]: string } = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800',
};

const statusColors: { [key: string]: string } = {
  SOLVED: 'bg-green-50 border-green-200',
  ATTEMPTED: 'bg-yellow-50 border-yellow-200',
  UNSEEN: 'bg-gray-50 border-gray-200',
};

/**
 * ProblemCard Component - Individual problem card
 */
export function ProblemCard({ problem, onViewDetails, onSave }: ProblemCardProps) {
  return (
    <div
      data-testid="problem-card"
      className={`border-2 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
        statusColors[problem.status || 'UNSEEN']
      }`}
      onClick={() => onViewDetails(problem.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{problem.title}</h3>
          <p className="text-sm text-gray-600 mt-1">ID: {problem.id}</p>
        </div>

        {/* Save Button */}
        <button
          data-testid="save-problem-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(problem.id);
          }}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {problem.isSaved ? (
            <Bookmark className="w-5 h-5 text-blue-600" fill="currentColor" />
          ) : (
            <BookmarkPlus className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Difficulty Badge */}
      <div className="mb-3 flex items-center gap-2">
        <span
          data-testid="difficulty-badge"
          className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
        {problem.rating && (
          <span className="flex items-center gap-1 text-xs text-yellow-600">
            <Heart className="w-3 h-3" fill="currentColor" />
            {problem.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-600">Acceptance</p>
          <p data-testid="acceptance-rate" className="text-sm font-semibold text-gray-900">
            {problem.acceptanceRate}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Submissions</p>
          <p className="text-sm font-semibold text-gray-900">{(problem.submissions / 1000).toFixed(1)}k</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Status</p>
          <p className="text-sm font-semibold text-gray-900">{problem.status || '—'}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
        {problem.tags.length > 3 && (
          <span className="text-xs text-gray-600 px-2 py-1">+{problem.tags.length - 3} more</span>
        )}
      </div>
    </div>
  );
}

/**
 * ProblemGrid Component - Grid of problem cards
 */
export function ProblemGrid({
  problems,
  isLoading,
  onViewDetails,
  onSave,
}: {
  problems: Problem[];
  isLoading: boolean;
  onViewDetails: (id: number) => void;
  onSave?: (id: number) => void;
}) {
  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div
        data-testid="no-results"
        className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <p className="text-gray-600 font-medium">No problems found</p>
        <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          onViewDetails={onViewDetails}
          onSave={onSave}
        />
      ))}
    </div>
  );
}

/**
 * TrendingProblems Component - Display trending problems
 */
export function TrendingProblems({
  problems,
  onViewDetails,
}: {
  problems: Problem[];
  onViewDetails: (id: number) => void;
}) {
  if (problems.length === 0) return null;

  return (
    <div data-testid="trending-section" className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-semibold text-gray-900">Trending This Week</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            data-testid="trending-problem-card"
            onClick={() => onViewDetails(problem.id)}
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-orange-100"
          >
            <h4 className="font-semibold text-gray-900 hover:text-orange-600 mb-2">
              {problem.title}
            </h4>
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColors[problem.difficulty]}`}
              >
                {problem.difficulty}
              </span>
              <span className="text-xs text-gray-600">{problem.acceptanceRate}% AC</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * RecommendedProblems Component - Display AI-recommended problems
 */
export function RecommendedProblems({
  problems,
  onViewDetails,
}: {
  problems: Array<Problem & { reason: string }>;
  onViewDetails: (id: number) => void;
}) {
  if (problems.length === 0) return null;

  return (
    <div data-testid="recommendations-section" className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended For You</h3>

      <div className="space-y-3">
        {problems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => onViewDetails(problem.id)}
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-blue-100 flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold text-gray-900">{problem.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{problem.reason}</p>
            </div>
            <span
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-4 ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
