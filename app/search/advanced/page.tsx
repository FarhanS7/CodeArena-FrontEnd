'use client';

import { useState, useEffect } from 'react';
import { SearchIcon, Settings2 } from 'lucide-react';
import {
  SavedProblems,
  SearchHistory,
  Autocomplete,
  SavedPresets,
  SearchStats,
} from '@/components/search';

interface SavedProblem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  acceptanceRate: number;
  collection?: string;
}

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'EASY',
      tags: ['Array', 'Hash Table'],
      acceptanceRate: 85,
      collection: 'Array',
    },
    {
      id: 2,
      title: 'Merge Intervals',
      difficulty: 'MEDIUM',
      tags: ['Array', 'Sorting'],
      acceptanceRate: 70,
      collection: 'Intervals',
    },
  ]);

  const [searchHistory] = useState([
    { id: 1, query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z', count: 5 },
    { id: 2, query: 'Array', timestamp: '2024-01-14T15:30:00Z', count: 3 },
  ]);

  const [presets] = useState([
    {
      id: 1,
      name: 'Easy Array',
      filters: { difficulty: 'EASY', tags: ['Array'] },
    },
  ]);

  const [currentFilters, setCurrentFilters] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <SearchIcon className="w-10 h-10 text-blue-600" />
            Advanced Problem Search
          </h1>
          <p className="text-lg text-gray-600">
            Find problems with advanced filters, saved presets, and personalized recommendations
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              data-testid="search-input"
              placeholder="Search problems by title, tags, difficulty..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-12"
            />
            <SearchIcon className="absolute right-4 top-3.5 w-6 h-6 text-gray-400" />

            {/* Autocomplete */}
            <Autocomplete
              suggestions={[
                { id: 1, title: 'Two Sum' },
                { id: 2, title: 'Two Sum II' },
              ]}
              isOpen={showAutocomplete && searchQuery.length > 0}
              onSelectSuggestion={(suggestion) => {
                setSearchQuery(suggestion.title);
                setShowAutocomplete(false);
              }}
            />

            {/* Search History */}
            <SearchHistory
              history={searchHistory}
              isOpen={showHistory && !searchQuery}
              onSelectHistory={(query) => setSearchQuery(query)}
              onDeleteHistory={() => {}}
              onClearAll={() => {}}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings2 className="w-4 h-4" />
              Presets
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Stats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Saved Presets Panel */}
            {showPresets && (
              <div className="mb-8">
                <SavedPresets
                  presets={presets}
                  isOpen={true}
                  onLoadPreset={(preset) => setCurrentFilters(preset.filters)}
                  onDeletePreset={() => {}}
                  onSavePreset={() => {}}
                  currentFilters={currentFilters}
                />
              </div>
            )}

            {/* Saved Problems */}
            <SavedProblems
              problems={savedProblems}
              onUnsave={(id) =>
                setSavedProblems(savedProblems.filter((p) => p.id !== id))
              }
              onExport={() => console.log('Export CSV')}
              onProblemClick={(id) => console.log('Click problem:', id)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search Stats */}
            {showStats && (
              <SearchStats
                stats={{
                  totalSearches: 150,
                  averageSearchTime: 2.5,
                  mostSearched: 'Two Sum',
                  trendingSearches: ['Two Sum', 'Array', 'DP'],
                }}
                isOpen={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
