'use client';

import { useState } from 'react';
import { ActivityFeed } from '@/components/social';

export default function FollowingFeedPage() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'SOLVED_PROBLEM' as const,
      actor: 'john_expert',
      problem: 'Two Sum',
      timestamp: '2024-01-15T14:30:00Z',
      engagement: 45,
    },
    {
      id: 2,
      type: 'CONTEST_PARTICIPATION' as const,
      actor: 'alice_dev',
      contest: 'Weekly Contest 1',
      rank: 5,
      timestamp: '2024-01-15T13:00:00Z',
      engagement: 200,
    },
    {
      id: 3,
      type: 'DISCUSSION_UPVOTE' as const,
      actor: 'bob_coder',
      timestamp: '2024-01-15T12:00:00Z',
      engagement: 30,
    },
    {
      id: 4,
      type: 'SOLVED_PROBLEM' as const,
      actor: 'expert_user',
      problem: 'Median of Two Sorted Arrays',
      timestamp: '2024-01-15T11:00:00Z',
      engagement: 120,
    },
    {
      id: 5,
      type: 'CONTEST_PARTICIPATION' as const,
      actor: 'coder_jane',
      contest: 'Biweekly Contest 2',
      rank: 12,
      timestamp: '2024-01-15T10:00:00Z',
      engagement: 85,
    },
  ]);

  const [activityFilter, setActivityFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const handleActivityClick = (activity: any) => {
    console.log('Clicked activity:', activity);
    // Navigate to relevant page
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more activities
    setTimeout(() => {
      setActivities((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'SOLVED_PROBLEM',
          actor: `user_${prev.length}`,
          problem: `Problem ${prev.length}`,
          timestamp: new Date().toISOString(),
          engagement: Math.floor(Math.random() * 100),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const filteredActivities =
    activityFilter === 'ALL'
      ? activities
      : activities.filter((a) => a.type === activityFilter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Following Activity</h1>
        <p className="text-gray-600">See what your followed users are up to</p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setActivityFilter('ALL')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activityFilter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActivityFilter('SOLVED_PROBLEM')}
          data-testid="filter-problems-solved"
          className={`px-4 py-2 rounded-full font-medium transition ${
            activityFilter === 'SOLVED_PROBLEM'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Problems Solved
        </button>
        <button
          onClick={() => setActivityFilter('CONTEST_PARTICIPATION')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activityFilter === 'CONTEST_PARTICIPATION'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Contests
        </button>
        <button
          onClick={() => setActivityFilter('DISCUSSION_UPVOTE')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activityFilter === 'DISCUSSION_UPVOTE'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Discussions
        </button>
      </div>

      {/* Activity Feed */}
      <ActivityFeed
        activities={filteredActivities}
        onActivityClick={handleActivityClick}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={filteredActivities.length < 50}
      />

      {/* Stats Sidebar */}
      <div className="mt-12 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold">Following</p>
          <p className="text-3xl font-bold text-blue-900">42</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-semibold">Followers</p>
          <p className="text-3xl font-bold text-green-900">156</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-semibold">This Week</p>
          <p className="text-3xl font-bold text-purple-900">28</p>
          <p className="text-xs text-purple-600">activities</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-orange-600 font-semibold">Engagement</p>
          <p className="text-3xl font-bold text-orange-900">2.1k</p>
          <p className="text-xs text-orange-600">actions</p>
        </div>
      </div>
    </div>
  );
}
