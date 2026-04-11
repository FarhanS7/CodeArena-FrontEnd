'use client';

import { Search, Code, Users } from 'lucide-react';

interface UserCard {
  id: number;
  username: string;
  rating: number;
  problemsSolved: number;
  followerCount: number;
  recentAchievements: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface UserDiscoveryProps {
  users: UserCard[];
  onFollowClick: (userId: number) => void;
  onUserClick: (userId: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRatingFilterChange: (minRating: number) => void;
}

export function UserDiscovery({
  users,
  onFollowClick,
  onUserClick,
  searchQuery,
  onSearchChange,
  onRatingFilterChange,
}: UserDiscoveryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Discover Users</h2>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="user-search-input"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <select
          onChange={(e) => onRatingFilterChange(Number(e.target.value))}
          data-testid="rating-filter"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="0">All Ratings</option>
          <option value="1000">1000+</option>
          <option value="1500">1500+</option>
          <option value="2000">2000+</option>
          <option value="2500">2500+</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            data-testid="user-card"
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => onUserClick(user.id)}
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
              <p className="text-sm text-blue-600 font-medium">{user.skillLevel}</p>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{user.problemsSolved} problems solved</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">{user.followerCount} followers</span>
              </div>
              <div className="text-lg font-bold text-purple-600">Rating: {user.rating}</div>
            </div>

            {/* Achievements */}
            {user.recentAchievements.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Recent Achievements</p>
                <div className="flex flex-wrap gap-1">
                  {user.recentAchievements.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Follow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowClick(user.id);
              }}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Follow User
            </button>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found matching your criteria
        </div>
      )}
    </div>
  );
}
