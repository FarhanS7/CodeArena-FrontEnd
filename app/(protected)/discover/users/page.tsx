'use client';

import { useState } from 'react';
import { UserDiscovery, FollowRecommendations, FollowersLeaderboard } from '@/components/social';

export default function UserDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  const mockUsers = [
    {
      id: 1,
      username: 'john_expert',
      rating: 2500,
      problemsSolved: 450,
      followerCount: 1200,
      recentAchievements: ['Master', 'Expert'],
      skillLevel: 'Expert' as const,
    },
    {
      id: 2,
      username: 'alice_dev',
      rating: 2100,
      problemsSolved: 320,
      followerCount: 800,
      recentAchievements: ['Advanced'],
      skillLevel: 'Advanced' as const,
    },
    {
      id: 3,
      username: 'bob_coder',
      rating: 1800,
      problemsSolved: 200,
      followerCount: 450,
      recentAchievements: [],
      skillLevel: 'Intermediate' as const,
    },
  ];

  const mockSuggestions = [
    {
      id: 101,
      username: 'recommended_expert',
      rating: 2600,
      problemsSolved: 500,
      reason: 'Popular in Array problems',
    },
    {
      id: 102,
      username: 'trending_user',
      rating: 2200,
      problemsSolved: 350,
      reason: 'Friends are following them',
    },
  ];

  const mockLeaderboard = [
    { rank: 1, username: 'top_follower', followerCount: 5000, rating: 2800, isCurrentUser: false },
    { rank: 2, username: 'second_place', followerCount: 4500, rating: 2700, isCurrentUser: false },
    { rank: 50, username: 'currentuser', followerCount: 100, rating: 1800, isCurrentUser: true },
  ];

  const handleFollowClick = (userId: number) => {
    alert(`Following user ${userId}`);
  };

  const handleUserClick = (userId: number) => {
    alert(`Viewing profile for user ${userId}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRatingFilterChange = (rating: number) => {
    setMinRating(rating);
  };

  const handleFollowUser = (id: number) => {
    alert(`Followed user ${id}`);
  };

  const handleDismissSuggestion = (id: number) => {
    alert(`Dismissed suggestion ${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Discover Users</h1>
        <p className="text-gray-600">Find talented coders and expand your network</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 flex gap-4">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
          Browse
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Recommendations
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Leaderboard
        </button>
      </div>

      {/* Main Content - Browse Tab */}
      <UserDiscovery
        users={mockUsers}
        onFollowClick={handleFollowClick}
        onUserClick={handleUserClick}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onRatingFilterChange={handleRatingFilterChange}
      />

      {/* Recommendations Section */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended to Follow</h2>
        <FollowRecommendations
          suggestions={mockSuggestions}
          onFollow={handleFollowUser}
          onDismiss={handleDismissSuggestion}
        />
      </div>

      {/* Leaderboard Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Top Followers</h2>
        <FollowersLeaderboard
          entries={mockLeaderboard}
          onUserClick={() => {}}
        />
      </div>
    </div>
  );
}
