'use client';

import { useState, useEffect } from 'react';
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

interface SearchHistoryItem {
  id: number;
  query: string;
  timestamp: string;
  count: number;
}

export default function AdvancedSearchPage() {
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSavedProblems();
    fetchSearchHistory();
  }, []);

  const fetchSavedProblems = async () => {
    try {
      const response = await fetch('/api/problems/saved');
      const data = await response.json();
      setSavedProblems(data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('/api/search/history');
      const data = await response.json();
      setSearchHistory(data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Advanced Search</h1>
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        {savedProblems.length > 0 && (
          <SavedProblems
            problems={savedProblems}
            onUnsave={() => {}}
            onExport={() => {}}
            onProblemClick={() => {}}
          />
        )}
      </div>
    </div>
  );
}
