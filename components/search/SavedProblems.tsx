'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

interface SavedProblem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  acceptanceRate: number;
  collection?: string;
}

interface SavedProblemsProps {
  problems: SavedProblem[];
  onUnsave: (problemId: number) => void;
  onExport: () => void;
  onProblemClick: (problemId: number) => void;
}

export function SavedProblems({
  problems,
  onUnsave,
  onExport,
  onProblemClick,
}: SavedProblemsProps) {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL' ? problems : problems.filter((p) => p.collection === filter);

  return (
    <div className="space-y-4" data-testid="saved-problems-section">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Problems</h2>
        <button
          onClick={onExport}
          data-testid="export-saved-btn"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded ${
            filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        {Array.from(new Set(problems.map((p) => p.collection))).map((collection) => (
          <button
            key={collection}
            onClick={() => setFilter(collection || 'OTHER')}
            className={`px-3 py-1 rounded ${
              filter === (collection || 'OTHER') ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {collection || 'Other'}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((problem) => (
          <div
            key={problem.id}
            data-testid="saved-problem-card"
            onClick={() => onProblemClick(problem.id)}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{problem.title}</h3>
                <p className="text-sm text-gray-600">Acceptance: {problem.acceptanceRate.toFixed(1)}%</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      problem.difficulty === 'EASY'
                        ? 'bg-green-100 text-green-800'
                        : problem.difficulty === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  {problem.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnsave(problem.id);
                }}
                data-testid="remove-saved-btn"
                className="text-red-500 hover:text-red-700"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
