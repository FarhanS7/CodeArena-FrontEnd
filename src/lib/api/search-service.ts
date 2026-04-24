import { apiClient } from './client';

// Types
export interface SavedProblem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  acceptanceRate: number;
  collection?: string;
}

export interface SearchHistory {
  id: number;
  query: string;
  timestamp: string;
  count: number;
}

export interface SearchPreset {
  id: number;
  name: string;
  filters: Record<string, any>;
}

export interface AutocompleteSuggestion {
  id: number;
  title: string;
}

// Search API Service
export class SearchService {
  // Saved Problems
  static async getSavedProblems() {
    return apiClient.get<SavedProblem[]>('/problems/saved');
  }

  static async unsaveProblem(problemId: number) {
    return apiClient.delete(`/problems/${problemId}/unsave`);
  }

  static async saveProblem(problemId: number, collection?: string) {
    return apiClient.post(`/problems/${problemId}/save`, { collection });
  }

  static async exportSavedProblems() {
    return apiClient.get<{ downloadUrl: string }>('/problems/saved/export');
  }

  // Search History
  static async getSearchHistory() {
    return apiClient.get<SearchHistory[]>('/search/history');
  }

  static async deleteSearchHistory(id: number) {
    return apiClient.delete(`/search/history/${id}`);
  }

  static async clearSearchHistory() {
    return apiClient.delete('/search/history');
  }

  // Autocomplete
  static async getAutocompleteSuggestions(query: string) {
    return apiClient.get<AutocompleteSuggestion[]>(`/problems/autocomplete?q=${query}`);
  }

  // Search Presets
  static async getSavedPresets() {
    return apiClient.get<SearchPreset[]>('/search/presets');
  }

  static async savePreset(name: string, filters: Record<string, any>) {
    return apiClient.post(`/search/presets`, { name, filters });
  }

  static async deletePreset(id: number) {
    return apiClient.delete(`/search/presets/${id}`);
  }

  static async loadPreset(id: number) {
    return apiClient.get<SearchPreset>(`/search/presets/${id}`);
  }

  // Search Statistics
  static async getSearchStats() {
    return apiClient.get<{
      totalSearches: number;
      averageSearchTime: number;
      mostSearched: string;
      trendingSearches: string[];
    }>('/search/stats');
  }

  static async getTrendingSearches() {
    return apiClient.get<
      Array<{
        query: string;
        searches: number;
        trend: 'up' | 'down' | 'stable';
      }>
    >('/search/trending');
  }

  // Advanced Search
  static async searchProblems(filters: {
    query?: string;
    difficulty?: string;
    minAcceptanceRate?: number;
    maxAcceptanceRate?: number;
    tags?: string[];
    page?: number;
    pageSize?: number;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });
    return apiClient.get(`/problems/search?${params.toString()}`);
  }
}
