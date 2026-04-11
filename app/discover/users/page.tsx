'use client';

import { useState } from 'react';
import { Users, Sparkles } from 'lucide-react';
import { UserDiscovery, FollowRecommendations } from '@/components/social';

export default function DiscoverUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  const [users] = useState([
    {
      id: 1,
      username: 'john_expert',
      rating: 2500,
      problemsSolved: 500,
      followerCount: 1200,
      recentAchievements: ['Master', 'Expert'],
      skillLevel: 'Expert' as const,
    },
    {
      id: 2,
      username: 'sarah_advanced',
      rating: 2100,
      problemsSolved: 350,
      followerCount: 800,
      recentAchievements: ['Advanced'],
      skillLevel: 'Advanced' as const,
    },
    {
      id: 3,
      username: 'mike_intermediate',
      rating: 1500,
      problemsSolved: 150,
      followerCount: 400,
      recentAchievements: ['Solid', 'Streak'],
      skillLevel: 'Intermediate' as const,
    },
  ]);

  const [suggestions] = useState([
    {
      id: 10,
      username: 'alex_master',
      rating: 2800,
      problemsSolved: 600,
      reason: 'Popular in Array problems',
    },
    {
      id: 11,
      username: 'emma_expert',
      rating: 2600,
      problemsSolved: 550,
      reason: 'Active in discussions',
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery === '';
    const matchesRating = user.rating >= minRating;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-600" />
            Discover Users
          </h1>
          <p className="text-lg text-gray-600">
            Find and follow top programmers in the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <UserDiscovery
              users={filteredUsers}
              onFollowClick={(userId) => console.log('Follow user:', userId)}
              onUserClick={(userId) => console.log('View user:', userId)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRatingFilterChange={setMinRating}
            />
          </div>

          {/* Sidebar - Recommendations */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FollowRecommendations
                suggestions={suggestions}
                onFollow={(id) => console.log('Follow suggestion:', id)}
                onDismiss={(id) => console.log('Dismiss suggestion:', id)}
              />

              {/* Quick Stats */}
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Community Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">50,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Today</span>
                    <span className="font-semibold">8,923</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Rating</span>
                    <span className="font-semibold">1,542</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
