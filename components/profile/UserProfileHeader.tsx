import { Edit2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
}

interface UserProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

/**
 * UserProfileHeader Component - Displays user info and profile header
 * Shows avatar, username, bio, location, and edit button
 */
export function UserProfileHeader({
  user,
  isOwnProfile,
  onEditProfile,
}: UserProfileHeaderProps) {
  const joinedDate = new Date(user.joinedAt);
  const joinedMonth = joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div
      data-testid="profile-header"
      className="bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <img
            data-testid="user-avatar"
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
          />

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 data-testid="username" className="text-3xl font-bold text-slate-900">
                  {user.username}
                </h1>
                <p className="text-sm text-slate-500">Joined {joinedMonth}</p>
              </div>

              {/* Edit Button - Only for own profile */}
              {isOwnProfile && (
                <button
                  data-testid="edit-profile-btn"
                  onClick={onEditProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Bio */}
            <p data-testid="bio" className="text-slate-700 mb-3">
              {user.bio}
            </p>

            {/* Location and Website */}
            <div className="flex gap-4 text-sm text-slate-600">
              {user.location && (
                <span data-testid="location" className="flex items-center gap-1">
                  📍 {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  🔗 Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
