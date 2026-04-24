import { apiClient } from './client';

// Types
export interface User {
  id: number;
  username: string;
  avatar?: string;
  rating: number;
  problemsSolved: number;
  followerCount: number;
}

export interface Follower {
  id: number;
  username: string;
  avatar?: string;
}

export interface FollowerStats {
  rank: number;
  username: string;
  followerCount: number;
  rating: number;
  isCurrentUser?: boolean;
}

export interface Activity {
  id: number;
  type: 'SOLVED_PROBLEM' | 'CONTEST_PARTICIPATION' | 'DISCUSSION_UPVOTE' | 'NEW_FOLLOWER';
  actor: string;
  problem?: string;
  contest?: string;
  rank?: number;
  timestamp: string;
  engagement?: number;
}

export interface FollowSuggestion {
  id: number;
  username: string;
  rating: number;
  problemsSolved: number;
  reason: string;
  avatar?: string;
}

export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean;
}

// Social API Service
export class SocialService {
  // Follow Actions
  static async followUser(userId: number) {
    return apiClient.post(`/users/${userId}/follow`, {});
  }

  static async unfollowUser(userId: number) {
    return apiClient.delete(`/users/${userId}/unfollow`);
  }

  static async getFollowStatus(userId: number) {
    return apiClient.get<FollowStatus>(`/users/${userId}/follow-status`);
  }

  // Followers & Following
  static async getFollowers(userId: number, page = 1, pageSize = 10) {
    return apiClient.get<{
      data: Follower[];
      total: number;
    }>(`/users/${userId}/followers?page=${page}&pageSize=${pageSize}`);
  }

  static async getFollowing(userId: number, page = 1, pageSize = 10) {
    return apiClient.get<{
      data: Follower[];
      total: number;
    }>(`/users/${userId}/following?page=${page}&pageSize=${pageSize}`);
  }

  // Leaderboard
  static async getFollowerLeaderboard(page = 1, pageSize = 20) {
    return apiClient.get<{
      data: FollowerStats[];
      total: number;
    }>(`/leaderboard/followers?page=${page}&pageSize=${pageSize}`);
  }

  // Activity Feed
  static async getFollowingActivityFeed(
    page = 1,
    pageSize = 20,
    type?: string,
  ) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (type) params.append('type', type);

    return apiClient.get<{
      data: Activity[];
      total: number;
    }>(`/feed/following?${params.toString()}`);
  }

  static async getGlobalActivityFeed(page = 1, pageSize = 20) {
    return apiClient.get<{
      data: Activity[];
      total: number;
    }>(`/feed/global?page=${page}&pageSize=${pageSize}`);
  }

  // User Discovery
  static async searchUsers(
    query: string,
    minRating?: number,
    page = 1,
    pageSize = 20,
  ) {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (minRating) params.append('minRating', String(minRating));

    return apiClient.get<{
      data: User[];
      total: number;
    }>(`/users/search?${params.toString()}`);
  }

  static async getUserSuggestions() {
    return apiClient.get<FollowSuggestion[]>('/users/suggestions');
  }

  static async dismissSuggestion(userId: number) {
    return apiClient.post(`/users/suggestions/${userId}/dismiss`, {});
  }

  // Recommendations
  static async getFollowRecommendations() {
    return apiClient.get<FollowSuggestion[]>('/users/recommendations');
  }

  // Statistics
  static async getFollowerStats(userId: number) {
    return apiClient.get<{
      current: number;
      data: Array<{
        date: string;
        count: number;
      }>;
    }>(`/users/${userId}/stats/followers`);
  }

  static async getActivityStats(userId: number) {
    return apiClient.get<{
      totalActivities: number;
      thisWeek: number;
      engagement: number;
    }>(`/users/${userId}/stats/activity`);
  }

  // Notifications
  static async getFollowNotifications(page = 1, pageSize = 20) {
    return apiClient.get(`/notifications/follow?page=${page}&pageSize=${pageSize}`);
  }
}
