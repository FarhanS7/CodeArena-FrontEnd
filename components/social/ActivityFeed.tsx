'use client';

import { Heart, Trophy, Code2, Users } from 'lucide-react';
import { format } from 'date-fns';

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

interface ActivityFeedProps {
  activities: ActivityItem[];
  onActivityClick: (activity: ActivityItem) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const iconMap = {
  SOLVED_PROBLEM: <Code2 className="w-5 h-5 text-green-500" />,
  CONTEST_PARTICIPATION: <Trophy className="w-5 h-5 text-yellow-500" />,
  DISCUSSION_UPVOTE: <Heart className="w-5 h-5 text-red-500" />,
  NEW_FOLLOWER: <Users className="w-5 h-5 text-blue-500" />,
};

export function ActivityFeed({
  activities,
  onActivityClick,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: ActivityFeedProps) {
  return (
    <div data-testid="activity-feed" className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Feed</h2>

      <div className="space-y-3">
        {activities.length === 0 && !isLoading ? (
          <div className="bg-gray-50 p-8 rounded text-center text-gray-500">
            No activities yet
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              data-testid="activity-item"
              onClick={() => onActivityClick(activity)}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{iconMap[activity.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    <span className="text-blue-600">{activity.actor}</span>
                    {activity.type === 'SOLVED_PROBLEM' && (
                      <>
                        {' '}solved{' '}
                        <span className="font-semibold text-gray-900">{activity.problem}</span>
                      </>
                    )}
                    {activity.type === 'CONTEST_PARTICIPATION' && (
                      <>
                        {' '}participated in{' '}
                        <span className="font-semibold text-gray-900">{activity.contest}</span>
                        {activity.rank && ` (Rank #${activity.rank})`}
                      </>
                    )}
                    {activity.type === 'DISCUSSION_UPVOTE' && (
                      <>
                        {' '}got an upvote on their comment
                      </>
                    )}
                    {activity.type === 'NEW_FOLLOWER' && (
                      <>
                        {' '}started following you
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-500">
          Loading more activities...
        </div>
      )}

      {hasMore && !isLoading && (
        <button
          onClick={onLoadMore}
          className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Load More
        </button>
      )}
    </div>
  );
}
