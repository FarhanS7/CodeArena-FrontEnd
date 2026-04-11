'use client';

import { useState } from 'react';

interface AutocompleteSuggestion {
  id: number;
  title: string;
}

interface AutocompleteProps {
  suggestions: AutocompleteSuggestion[];
  isOpen: boolean;
  onSelectSuggestion: (suggestion: AutocompleteSuggestion) => void;
  isLoading?: boolean;
}

export function Autocomplete({
  suggestions,
  isOpen,
  onSelectSuggestion,
  isLoading = false,
}: AutocompleteProps) {
  const [highlighted, setHighlighted] = useState<number>(-1);

  if (!isOpen) return null;

  return (
    <div
      data-testid="autocomplete-suggestions"
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
      ) : suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No suggestions found</div>
      ) : (
        <ul>
          {suggestions.map((suggestion, idx) => (
            <li
              key={suggestion.id}
              onMouseEnter={() => setHighlighted(idx)}
              onMouseLeave={() => setHighlighted(-1)}
              onClick={() => onSelectSuggestion(suggestion)}
              data-testid={`suggestion-${suggestion.title}`}
              className={`px-4 py-2 cursor-pointer transition ${
                highlighted === idx ? 'bg-blue-100' : 'hover:bg-gray-50'
              }`}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
