'use client';

import { useState } from 'react';
import { Activity, Filter } from 'lucide-react';
import { ActivityFeed, FollowersLeaderboard } from '@/components/social';

export default function FollowingFeedPage() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [activities] = useState([
    {
      id: 1,
      type: 'SOLVED_PROBLEM' as const,
      actor: 'john_expert',
      problem: 'Two Sum',
      timestamp: '2024-01-15T14:30:00Z',
    },
    {
      id: 2,
      type: 'CONTEST_PARTICIPATION' as const,
      actor: 'sarah_advanced',
      contest: 'Weekly Contest #1',
      rank: 5,
      timestamp: '2024-01-15T13:15:00Z',
    },
    {
      id: 3,
      type: 'DISCUSSION_UPVOTE' as const,
      actor: 'mike_intermediate',
      timestamp: '2024-01-15T12:00:00Z',
    },
    {
      id: 4,
      type: 'SOLVED_PROBLEM' as const,
      actor: 'alex_master',
      problem: 'Merge Intervals',
      timestamp: '2024-01-15T11:45:00Z',
    },
  ]);

  const [leaderboardEntries] = useState([
    {
      rank: 1,
      username: 'john_expert',
      followerCount: 5000,
      rating: 2800,
    },
    {
      rank: 2,
      username: 'sarah_advanced',
      followerCount: 4500,
      rating: 2600,
    },
    {
      rank: 50,
      username: 'current_user',
      followerCount: 150,
      rating: 1800,
      isCurrentUser: true,
    },
  ]);

  const filterTypes = [
    { value: 'SOLVED_PROBLEM', label: 'Problems Solved' },
    { value: 'CONTEST_PARTICIPATION', label: 'Contests' },
    { value: 'DISCUSSION_UPVOTE', label: 'Discussions' },
    { value: 'NEW_FOLLOWER', label: 'New Followers' },
  ];

  const filteredActivities = filterType
    ? activities.filter((a) => a.type === filterType)
    : activities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Activity className="w-10 h-10 text-green-600" />
            Following Activity
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with your followed users activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filter by Activity Type</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType(null)}
                  data-testid="filter-all"
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterType === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  All Activity
                </button>
                {filterTypes.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterType(filter.value)}
                    data-testid={`filter-${filter.value.toLowerCase()}`}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterType === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed
              activities={filteredActivities}
              onActivityClick={(activity) => console.log('Click activity:', activity)}
              isLoading={isLoadingMore}
              onLoadMore={() => {
                setIsLoadingMore(true);
                setTimeout(() => setIsLoadingMore(false), 1000);
              }}
              hasMore={true}
            />
          </div>

          {/* Sidebar - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FollowersLeaderboard
                entries={leaderboardEntries}
                onUserClick={(username) => console.log('View profile:', username)}
              />

              {/* Activity Stats */}
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Your Feed Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Following</span>
                    <span className="font-semibold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-semibold">152</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity This Week</span>
                    <span className="font-semibold">89</span>
                  </div>
                </div>
              </div>

              {/* Engagement Chart */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Top Activity Types</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Problems Solved', count: 45, percent: 50 },
                    { label: 'Contests', count: 25, percent: 28 },
                    { label: 'Discussions', count: 15, percent: 17 },
                    { label: 'Other', count: 4, percent: 5 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
