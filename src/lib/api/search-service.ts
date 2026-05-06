import { apiClient } from './client';

// Types
export interface SavedProblem {
  id: number;
  userId: string;
  problemId: number;
  collection: string;
  createdAt: string;
}

export interface SearchHistory {
  id: number;
  userId: string;
  query: string;
  count: number;
  timestamp: string;
}

export interface SearchPreset {
  id: number;
  userId: string;
  name: string;
  filters: any;
  createdAt: string;
}

export interface AutocompleteSuggestion {
  id: number;
  title: string;
}

// Search API Service
export class SearchService {
  // Advanced Search
  static async searchProblems(query: string = '', difficulty?: string, tags?: string[]) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (difficulty) params.append('difficulty', difficulty);
    if (tags && tags.length > 0) params.append('tags', tags.join(','));

    return apiClient.get<{
      data: any[];
      total: number;
      processingTimeMs: number;
    }>(`/search/problems?${params.toString()}`);
  }

  // Autocomplete
  static async getAutocomplete(query: string) {
    return apiClient.get<{ data: AutocompleteSuggestion[] }>(`/search/autocomplete?q=${query}`);
  }

  // Recommendations
  static async getRecommendations() {
    return apiClient.get<{ data: any[] }>(`/search/recommendations`);
  }

  // Saved Problems
  static async getSavedProblems() {
    return apiClient.get<SavedProblem[]>('/search/saved');
  }

  static async saveProblem(problemId: number, collection: string = 'default') {
    return apiClient.post(`/search/saved/${problemId}`, { collection });
  }

  static async unsaveProblem(problemId: number) {
    return apiClient.delete(`/search/saved/${problemId}`);
  }

  // Search History
  static async getSearchHistory() {
    return apiClient.get<SearchHistory[]>('/search/history');
  }

  static async deleteHistoryItem(id: number) {
    return apiClient.delete(`/search/history/${id}`);
  }

  static async clearHistory() {
    return apiClient.delete('/search/history');
  }

  // Presets
  static async getPresets() {
    return apiClient.get<SearchPreset[]>('/search/presets');
  }

  static async savePreset(name: string, filters: any) {
    return apiClient.post('/search/presets', { name, filters });
  }

  static async deletePreset(id: number) {
    return apiClient.delete(`/search/presets/${id}`);
  }

  // Trending
  static async getTrending() {
    return apiClient.get<{ data: any[] }>('/search/trending');
  }
}
