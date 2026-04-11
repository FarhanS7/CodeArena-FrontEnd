'use client';

import { Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SearchHistoryItem {
  id: number;
  query: string;
  timestamp: string;
  count: number;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectHistory: (query: string) => void;
  onDeleteHistory: (id: number) => void;
  onClearAll: () => void;
  isOpen: boolean;
}

export function SearchHistory({
  history,
  onSelectHistory,
  onDeleteHistory,
  onClearAll,
  isOpen,
}: SearchHistoryProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="history-panel"
      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Search History</h3>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            data-testid="clear-history-btn"
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      <div data-testid="recent-searches-list" className="space-y-2 max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <p data-testid="history-empty" className="text-sm text-gray-500 text-center py-4">
            No search history
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <div
                onClick={() => onSelectHistory(item.query)}
                data-testid={`history-item-${item.query}`}
                className="flex-1 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{item.query}</p>
                  <p className="text-xs text-gray-500">{item.count} results</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHistory(item.id);
                }}
                data-testid={`delete-history-item-${item.id}`}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
