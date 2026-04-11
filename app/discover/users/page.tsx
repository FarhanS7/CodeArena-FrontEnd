'use client';

import { useState, useEffect } from 'react';
import { UserDiscovery, FollowRecommendations } from '@/components/social';

interface UserCard {
  id: number;
  username: string;
  rating: number;
  problemsSolved: number;
  followerCount: number;
  recentAchievements: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Suggestion {
  id: number;
  username: string;
  rating: number;
  problemsSolved: number;
  reason: string;
  avatar?: string;
}

export default function DiscoverUsersPage() {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchSuggestions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users?search=${searchQuery}&minRating=${minRating}`
      );
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/users/suggestions');
      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleFollow = (userId: number) => {
    console.log('Following user:', userId);
  };

  const handleDismiss = (id: number) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Discovery */}
          <div className="lg:col-span-2">
            <UserDiscovery
              users={users}
              onFollowClick={handleFollow}
              onUserClick={(id) => console.log('User clicked:', id)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRatingFilterChange={setMinRating}
            />
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <FollowRecommendations
              suggestions={suggestions}
              onFollow={handleFollow}
              onDismiss={handleDismiss}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
