import { useState, useEffect, useCallback } from 'react';
import {
  SocialService,
  User,
  Follower,
  Activity,
  FollowStatus,
  FollowerStats,
  FollowSuggestion,
} from '@/lib/api';

// useFollowUser Hook
export function useFollowUser(userId: number) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SocialService.getFollowStatus(userId);
      setIsFollowing(response.data.isFollowing);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const follow = useCallback(async () => {
    try {
      await SocialService.followUser(userId);
      setIsFollowing(true);
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId]);

  const unfollow = useCallback(async () => {
    try {
      await SocialService.unfollowUser(userId);
      setIsFollowing(false);
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  return { isFollowing, isLoading, error, follow, unfollow };
}

// useFollowers Hook
export function useFollowers(userId: number) {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFollowers = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await SocialService.getFollowers(userId, page);
        setFollowers(response.data.data);
        setTotal(response.data.total);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    loadFollowers();
  }, [loadFollowers]);

  return { followers, total, isLoading, error, reload: loadFollowers };
}

// useFollowersLeaderboard Hook
export function useFollowersLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<FollowerStats[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await SocialService.getFollowerLeaderboard(page);
      setLeaderboard(response.data.data);
      setTotal(response.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return { leaderboard, total, isLoading, error, reload: loadLeaderboard };
}

// useActivityFeed Hook
export function useActivityFeed(type?: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await SocialService.getFollowingActivityFeed(page, 20, type);
        setActivities(response.data.data);
        setTotal(response.data.total);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [type],
  );

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return { activities, total, isLoading, error, reload: loadActivities };
}

// useUserDiscovery Hook
export function useUserDiscovery(query: string, minRating?: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await SocialService.searchUsers(query, minRating);
        setUsers(response.data.data);
        setTotal(response.data.total);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [query, minRating]);

  return { users, total, isLoading, error };
}

// useFollowSuggestions Hook
export function useFollowSuggestions() {
  const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SocialService.getUserSuggestions();
      setSuggestions(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismiss = useCallback(async (userId: number) => {
    try {
      await SocialService.dismissSuggestion(userId);
      setSuggestions((prev) => prev.filter((s) => s.id !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  return { suggestions, isLoading, error, dismiss, reload: loadSuggestions };
}
