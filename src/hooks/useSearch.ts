import { useState, useEffect, useCallback } from 'react';
import { SearchService, SavedProblem, SearchHistory, SearchPreset } from '@/lib/api';

// useSearchHistory Hook
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SearchService.getSearchHistory();
      setHistory(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(
    async (id: number) => {
      try {
        await SearchService.deleteSearchHistory(id);
        setHistory((prev) => prev.filter((h) => h.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [],
  );

  const clearAll = useCallback(async () => {
    try {
      await SearchService.clearSearchHistory();
      setHistory([]);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { history, isLoading, error, deleteItem, clearAll, reload: loadHistory };
}

// useSavedProblems Hook
export function useSavedProblems() {
  const [problems, setProblems] = useState<SavedProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProblems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SearchService.getSavedProblems();
      setProblems(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsave = useCallback(async (problemId: number) => {
    try {
      await SearchService.unsaveProblem(problemId);
      setProblems((prev) => prev.filter((p) => p.id !== problemId));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  return { problems, isLoading, error, unsave, reload: loadProblems };
}

// useSearchPresets Hook
export function useSearchPresets() {
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SearchService.getSavedPresets();
      setPresets(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(
    async (name: string, filters: Record<string, any>) => {
      try {
        const response = await SearchService.savePreset(name, filters);
        const newPreset = {
          id: Date.now(),
          name,
          filters,
        };
        setPresets((prev) => [...prev, newPreset]);
        return newPreset;
      } catch (err: any) {
        setError(err.message);
      }
    },
    [],
  );

  const deletePreset = useCallback(async (id: number) => {
    try {
      await SearchService.deletePreset(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  return { presets, isLoading, error, save, deletePreset, reload: loadPresets };
}

// useAutocomplete Hook
export function useAutocomplete(query: string, enabled = true) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await SearchService.getAutocompleteSuggestions(query);
        setSuggestions(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query, enabled]);

  return { suggestions, isLoading, error };
}

// useSearchStats Hook
export function useSearchStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const response = await SearchService.getSearchStats();
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, isLoading, error };
}
