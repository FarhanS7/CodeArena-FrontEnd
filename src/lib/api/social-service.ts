import { apiClient } from './client';

// Types
export interface User {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  problemsSolved: number;
  followerCount: number;
}

export interface Activity {
  id: number;
  userId: string;
  type: 'SOLVED' | 'FOLLOWED' | 'ACHIEVEMENT';
  content: string;
  metadata?: any;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface Achievement {
  id: number;
  userId: string;
  achievementType: string;
  title: string;
  earnedAt: string;
}

// Social API Service
export class SocialService {
  // Follow Actions
  static async followUser(userId: string) {
    return apiClient.post(`/social/follow/${userId}`, {});
  }

  static async unfollowUser(userId: string) {
    return apiClient.delete(`/social/follow/${userId}`);
  }

  // Followers & Following
  static async getFollowers(userId: string) {
    return apiClient.get<any[]>(`/social/followers/${userId}`);
  }

  static async getFollowing(userId: string) {
    return apiClient.get<any[]>(`/social/following/${userId}`);
  }

  // Activity Feed
  static async getActivityFeed() {
    return apiClient.get<Activity[]>(`/social/feed`);
  }

  // Notifications
  static async getNotifications() {
    return apiClient.get<Notification[]>(`/social/notifications`);
  }

  static async markNotificationAsRead(id: number) {
    return apiClient.post(`/social/notifications/${id}/read`, {});
  }

  // Achievements
  static async getAchievements(userId: string) {
    return apiClient.get<Achievement[]>(`/social/achievements/${userId}`);
  }
}
