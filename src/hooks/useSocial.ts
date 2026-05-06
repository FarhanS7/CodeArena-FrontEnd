import { useState, useEffect, useCallback } from 'react';
import {
  SocialService,
  Activity,
  Notification,
  Achievement,
} from '@/lib/api';

// useFollowUser Hook
export function useFollowUser(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const follow = useCallback(async () => {
    setIsLoading(true);
    try {
      await SocialService.followUser(userId);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const unfollow = useCallback(async () => {
    setIsLoading(true);
    try {
      await SocialService.unfollowUser(userId);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { isLoading, error, follow, unfollow };
}

// useActivityFeed Hook
export function useActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SocialService.getActivityFeed();
      setActivities(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return { activities, isLoading, error, reload: loadActivities };
}

// useNotifications Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SocialService.getNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await SocialService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return { notifications, isLoading, error, reload: loadNotifications, markAsRead };
}

// useAchievements Hook
export function useAchievements(userId: string) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await SocialService.getAchievements(userId);
      setAchievements(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  return { achievements, isLoading, error, reload: loadAchievements };
}
