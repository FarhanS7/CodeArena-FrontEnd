import { apiClient } from './client';

// Types
export interface EmailPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface UserEmail {
  email: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: 'DAILY' | 'WEEKLY';
  deliveryDay?: string;
  deliveryTime?: string;
  contents: {
    activity: boolean;
    learnings: boolean;
    trending: boolean;
  };
}

export interface EmailNotification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

// Email API Service
export class EmailService {
  // Email Preferences
  static async getEmailPreferences() {
    return apiClient.get<EmailPreference[]>('/email/preferences');
  }

  static async updateEmailPreference(id: string, enabled: boolean) {
    return apiClient.put(`/email/preferences/${id}`, { enabled });
  }

  static async setEmailFrequency(frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY') {
    return apiClient.put('/email/frequency', { frequency });
  }

  // Email Address Management
  static async getUserEmail() {
    return apiClient.get<UserEmail>('/email/address');
  }

  static async updateUserEmail(email: string) {
    return apiClient.put('/email/address', { email });
  }

  static async verifyEmail(token: string) {
    return apiClient.post('/email/verify', { token });
  }

  static async resendVerificationEmail() {
    return apiClient.post('/email/resend-verification', {});
  }

  static async unsubscribeFromAll() {
    return apiClient.post('/email/unsubscribe-all', {});
  }

  // Digest Settings
  static async getDigestSettings() {
    return apiClient.get<DigestSettings>('/email/digest-settings');
  }

  static async updateDigestSettings(settings: Partial<DigestSettings>) {
    return apiClient.put('/email/digest-settings', settings);
  }

  static async previewDigest() {
    return apiClient.get<{
      subject: string;
      previewHtml: string;
    }>('/email/digest-preview');
  }

  // Notifications
  static async getEmailNotifications(page = 1, pageSize = 20) {
    return apiClient.get<{
      data: EmailNotification[];
      total: number;
    }>(`/email/notifications?page=${page}&pageSize=${pageSize}`);
  }

  static async dismissNotification(id: number) {
    return apiClient.delete(`/email/notifications/${id}`);
  }

  static async markNotificationAsRead(id: number) {
    return apiClient.put(`/email/notifications/${id}/read`, { read: true });
  }

  // Email Analytics (Admin)
  static async getEmailMetrics() {
    return apiClient.get<{
      totalSent: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
      unsubscribeRate: number;
    }>('/admin/email/metrics');
  }

  static async getEmailHistory(page = 1, pageSize = 20) {
    return apiClient.get(`/admin/email/history?page=${page}&pageSize=${pageSize}`);
  }

  static async exportEmailReport() {
    return apiClient.get<{ downloadUrl: string }>('/admin/email/export');
  }

  // Unsubscribe (Token-based)
  static async unsubscribeFromToken(token: string, type?: string) {
    return apiClient.post('/email/unsubscribe', { token, type });
  }
}
