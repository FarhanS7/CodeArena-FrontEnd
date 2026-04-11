'use client';

import { X, UserMinus } from 'lucide-react';

interface Follower {
  id: number;
  username: string;
  avatar?: string;
}

interface FollowersListProps {
  followers: Follower[];
  isOpen: boolean;
  onClose: () => void;
  onUnfollow: (followerId: number) => void;
  onFollowerClick: (followerId: number) => void;
  title: string;
}

export function FollowersList({
  followers,
  isOpen,
  onClose,
  onUnfollow,
  onFollowerClick,
  title,
}: FollowersListProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      data-testid={`${title.toLowerCase()}-modal`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {followers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {title.toLowerCase()} yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {followers.map((follower) => (
                <li
                  key={follower.id}
                  data-testid={`follower-${follower.username}`}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onFollowerClick(follower.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {follower.avatar && (
                        <img
                          src={follower.avatar}
                          alt={follower.username}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span className="font-medium hover:text-blue-600">
                        {follower.username}
                      </span>
                    </button>
                    <button
                      onClick={() => onUnfollow(follower.id)}
                      data-testid={`unfollow-from-list-${follower.id}`}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
