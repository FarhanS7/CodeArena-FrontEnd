import { apiClient } from './client';

// Types
export interface EmailPreference {
  userId: string;
  contestUpdates: boolean;
  submissionUpdates: boolean;
  discussionReplies: boolean;
  emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
}

export interface EmailAnalytics {
  totalSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface EmailNotification {
  id: string;
  type: string;
  subject: string;
  sentAt: string;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: 'DAILY' | 'WEEKLY';
  dayOfWeek?: number;
}

// Email API Service
export class EmailService {
  // Preferences
  static async getPreferences() {
    return apiClient.get<EmailPreference>('/email/preferences');
  }

  static async updatePreferences(preferences: Partial<EmailPreference>) {
    return apiClient.put('/email/preferences', preferences);
  }

  // Verification & Auth
  static async sendVerificationEmail(to: string, token: string) {
    return apiClient.post('/email/verify', { to, token });
  }

  static async sendResetPasswordEmail(to: string, token: string) {
    return apiClient.post('/email/reset-password', { to, token });
  }

  // Contest Reminders
  static async sendContestReminder(to: string, contestName: string, startTime: string) {
    return apiClient.post('/email/contest-reminder', { to, contestName, startTime });
  }

  // Analytics (Admin)
  static async getAnalytics() {
    return apiClient.get<EmailAnalytics>('/email/analytics');
  }
}
