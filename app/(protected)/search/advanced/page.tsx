'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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

interface SearchPreset {
  id: number;
  name: string;
  filters: Record<string, any>;
}

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [autocompletes, setAutocompletes] = useState<any[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filtersDifficulty, setFiltersDifficulty] = useState('ALL');
  const [filtersAcceptanceMin, setFiltersAcceptanceMin] = useState(0);
  const [filtersAcceptanceMax, setFiltersAcceptanceMax] = useState(100);

  // Mock data - replace with real API calls
  useEffect(() => {
    setSavedProblems([
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
        title: 'Median of Two Sorted Arrays',
        difficulty: 'HARD',
        tags: ['Array', 'Divide and Conquer'],
        acceptanceRate: 42,
        collection: 'Array',
      },
    ]);

    setSearchHistory([
      { id: 1, query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z', count: 5 },
      { id: 2, query: 'Array', timestamp: '2024-01-14T15:30:00Z', count: 3 },
    ]);

    setPresets([
      { id: 1, name: 'Easy Array', filters: { difficulty: 'EASY', tags: ['Array'] } },
      { id: 2, name: 'Hard DP', filters: { difficulty: 'HARD', tags: ['Dynamic Programming'] } },
    ]);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to history
      setSearchHistory((prev) => [
        { id: Date.now(), query: searchQuery, timestamp: new Date().toISOString(), count: 1 },
        ...prev,
      ]);
    }
  };

  const handleUnsave = (problemId: number) => {
    setSavedProblems((prev) => prev.filter((p) => p.id !== problemId));
  };

  const handleDeleteHistory = (id: number) => {
    setSearchHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleSelectHistory = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setSearchQuery(suggestion.title);
  };

  const handleLoadPreset = (preset: SearchPreset) => {
    setFiltersDifficulty(preset.filters.difficulty || 'ALL');
  };

  const handleDeletePreset = (id: number) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePreset = (name: string, filters: Record<string, any>) => {
    setPresets((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        filters,
      },
    ]);
  };

  const handleExport = () => {
    const csv = savedProblems
      .map((p) => `${p.id},${p.title},${p.difficulty},${p.acceptanceRate}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-problems.csv';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Advanced Problem Search</h1>

      {/* Main Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onClick={() => setShowHistory(true)}
              data-testid="search-input"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchHistory
              history={searchHistory}
              isOpen={showHistory}
              onSelectHistory={handleSelectHistory}
              onDeleteHistory={handleDeleteHistory}
              onClearAll={handleClearHistory}
            />
          </div>
          <button
            onClick={handleSearch}
            data-testid="search-btn"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            data-testid="search-stats-btn"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Stats
          </button>
        </div>
      </div>

      {/* Search Stats */}
      {showStats && (
        <div className="mb-8">
          <SearchStats
            isOpen={true}
            stats={{
              totalSearches: 150,
              averageSearchTime: 2.5,
              mostSearched: 'Two Sum',
              trendingSearches: ['Two Sum', 'Array', 'DP'],
            }}
          />
        </div>
      )}

      {/* Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-2">Difficulty</label>
          <select
            value={filtersDifficulty}
            onChange={(e) => setFiltersDifficulty(e.target.value)}
            data-testid="difficulty-filter"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Min Acceptance Rate</label>
          <input
            type="number"
            min="0"
            max="100"
            value={filtersAcceptanceMin}
            onChange={(e) => setFiltersAcceptanceMin(Number(e.target.value))}
            data-testid="min-acceptance-rate"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Max Acceptance Rate</label>
          <input
            type="number"
            min="0"
            max="100"
            value={filtersAcceptanceMax}
            onChange={(e) => setFiltersAcceptanceMax(Number(e.target.value))}
            data-testid="max-acceptance-rate"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-end">
          <button
            data-testid="filter-apply-btn"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Problems */}
        <div className="lg:col-span-2">
          <SavedProblems
            problems={savedProblems}
            onUnsave={handleUnsave}
            onExport={handleExport}
            onProblemClick={() => {}}
          />
        </div>

        {/* Sidebar - Presets */}
        <div>
          <SavedPresets
            presets={presets}
            isOpen={true}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
            onSavePreset={handleSavePreset}
            currentFilters={{
              difficulty: filtersDifficulty,
              acceptanceMin: filtersAcceptanceMin,
              acceptanceMax: filtersAcceptanceMax,
            }}
          />
        </div>
      </div>
    </div>
  );
}
