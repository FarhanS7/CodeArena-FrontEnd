'use client';

import { useState, useEffect } from 'react';
import { ActivityFeed } from '@/components/social';

interface ActivityItem {
  id: number;
  type: 'SOLVED_PROBLEM' | 'CONTEST_PARTICIPATION' | 'DISCUSSION_UPVOTE' | 'NEW_FOLLOWER';
  actor: string;
  problem?: string;
  contest?: string;
  rank?: number;
  timestamp: string;
  engagement?: number;
}

export default function FollowingFeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [page]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/feed/following?page=${page}`);
      const data = await response.json();
      if (page === 1) {
        setActivities(data.data || []);
      } else {
        setActivities([...activities, ...(data.data || [])]);
      }
      setHasMore(data.hasMore !== false);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <ActivityFeed
          activities={activities}
          onActivityClick={(activity) =>
            console.log('Activity clicked:', activity.id)
          }
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
