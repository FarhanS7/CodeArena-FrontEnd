'use client';

import { UserPlus, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  isLoading?: boolean;
}

export function FollowButton({
  userId,
  isFollowing,
  onFollow,
  onUnfollow,
  isLoading = false,
}: FollowButtonProps) {
  return (
    <button
      data-testid="follow-btn"
      onClick={isFollowing ? onUnfollow : onFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
        isFollowing
          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
}
