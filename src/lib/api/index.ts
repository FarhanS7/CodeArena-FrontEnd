// Export all API services
export { apiClient, apiConfig, type ApiResponse, type ApiError } from './client';
export { SearchService, type SavedProblem, type SearchHistory, type SearchPreset } from './search-service';
export { EmailService, type EmailPreference, type UserEmail, type DigestSettings } from './email-service';
export { SocialService, type User, type Follower, type Activity, type FollowStatus } from './social-service';
