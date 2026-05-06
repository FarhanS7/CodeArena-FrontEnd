'use client';

import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchInput Component - Problem search field
 */
export function SearchInput({ onSearch, placeholder = 'Search by problem title, tags...' }: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          data-testid="search-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="flex-1 px-3 py-3 focus:outline-none"
        />
        {value && (
          <button
            onClick={handleClear}
            className="px-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          data-testid="search-btn"
          onClick={handleSearch}
          className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-r-lg font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}

/**
 * FilterPanel Component - Problem filtering options
 */
export function FilterPanel({
  onDifficultyChange,
  onTagsChange,
  onStatusChange,
  onMinAcceptanceChange,
  onMaxAcceptanceChange,
  onApplyFilters,
  onClearFilters,
}: {
  onDifficultyChange: (val: string) => void;
  onTagsChange: (tags: string[]) => void;
  onStatusChange: (val: string) => void;
  onMinAcceptanceChange: (val: string) => void;
  onMaxAcceptanceChange: (val: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availableTags = ['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Graph', 'Tree', 'Greedy', 'Binary Search'];

  const handleTagToggle = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    onTagsChange(updated);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
        <select
          data-testid="difficulty-filter"
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
        <select
          data-testid="status-filter"
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="SOLVED">Solved</option>
          <option value="ATTEMPTED">Attempted</option>
          <option value="UNSEEN">Unseen</option>
        </select>
      </div>

      {/* Acceptance Rate Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Acceptance Rate</label>
        <div className="flex gap-2">
          <input
            type="number"
            data-testid="min-acceptance-rate"
            min="0"
            max="100"
            placeholder="Min %"
            onChange={(e) => onMinAcceptanceChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            data-testid="max-acceptance-rate"
            min="0"
            max="100"
            placeholder="Max %"
            onChange={(e) => onMaxAcceptanceChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
        <button
          data-testid="tags-filter"
          className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          onClick={() => {}}
        >
          Select Tags
          <Filter className="w-4 h-4" />
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          data-testid="filter-apply-btn"
          onClick={onApplyFilters}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Apply Filters
        </button>
        <button
          data-testid="clear-filters-btn"
          onClick={onClearFilters}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

/**
 * SortSelect Component - Sorting options
 */
export function SortSelect({
  onSortChange,
}: {
  onSortChange: (sortBy: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        data-testid="sort-select"
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="recent">Most Recent</option>
        <option value="difficulty">Difficulty</option>
        <option value="acceptance-rate">Acceptance Rate</option>
        <option value="rating">Rating</option>
        <option value="submissions">Submissions</option>
      </select>
    </div>
  );
}
