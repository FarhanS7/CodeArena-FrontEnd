// Export all API services
export { apiClient, apiConfig, type ApiResponse, type ApiError } from './client';
export { SearchService, type SavedProblem, type SearchHistory, type SearchPreset, type AutocompleteSuggestion } from './search-service';
export { EmailService, type EmailPreference, type EmailAnalytics, type EmailNotification, type DigestSettings } from './email-service';
export { SocialService, type User, type Activity, type Notification, type Achievement } from './social-service';
