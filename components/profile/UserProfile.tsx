'use client';

import { useState } from 'react';
import { Settings, Edit2 } from 'lucide-react';
import { UserProfileHeader } from './UserProfileHeader';
import { UserStatsDisplay } from './UserStatsDisplay';
import { UserRatingProgress } from './UserRatingProgress';
import { UserSubmissionStats } from './UserSubmissionStats';
import { UserSubmissionHistory } from './UserSubmissionHistory';
import { UserContestHistory } from './UserContestHistory';
import { UserAchievements } from './UserAchievements';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
}

interface Stats {
  problemsSolved: number;
  submissionAccepted: number;
  submissionTotal: number;
  contestsParticipated: number;
  rating: number;
  maxRating: number;
  acceptanceRate: number;
  averageTime: number;
  globalRank: number;
  totalUsers: number;
  percentile: number;
}

interface Submission {
  id: string;
  problemId: number;
  problemTitle: string;
  status: string;
  language: string;
  submittedAt: string;
  score: number;
}

interface Contest {
  id: number;
  title: string;
  rank: number;
  score: number;
  participantCount: number;
  ratingChange: number;
  date: string;
}

interface RatingHistoryPoint {
  date: string;
  rating: number;
}

interface UserProfileProps {
  userId: string;
  user: User;
  stats: Stats;
  submissions: Submission[];
  contests: Contest[];
  ratingHistory: RatingHistoryPoint[];
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

type TabType = 'overview' | 'submissions' | 'contests' | 'achievements';

/**
 * UserProfile Component - Main profile display component
 * Displays user information, statistics, submission history, and contest history
 */
export function UserProfile({
  userId,
  user,
  stats,
  submissions,
  contests,
  ratingHistory,
  isOwnProfile,
  onEditProfile,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<string>('ALL');
  const [submissionSort, setSubmissionSort] = useState<string>('date');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Profile Header */}
      <UserProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onEditProfile={onEditProfile}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview Section */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <UserStatsDisplay stats={stats} />
            </div>

            {/* Rating Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <UserRatingProgress stats={stats} />
              </div>
              <UserSubmissionStats stats={stats} />
            </div>

            {/* Leaderboard Position Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Leaderboard Position</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Global Rank</p>
                  <p data-testid="global-rank" className="text-3xl font-bold text-blue-600">
                    #{stats.globalRank}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">out of {stats.totalUsers.toLocaleString()} users</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Percentile</p>
                  <p data-testid="percentile" className="text-3xl font-bold text-green-600">
                    {stats.percentile.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">top performer</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              data-testid="submissions-tab"
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('contests')}
              data-testid="contests-tab"
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'contests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Contests
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'achievements'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Achievements
            </button>

            {/* Settings Button - Right aligned */}
            <div className="ml-auto">
              <button
                data-testid="profile-settings-btn"
                className="p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-600 hover:text-slate-900"
                title="Profile Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Tab Content */}
        {activeTab === 'submissions' && (
          <UserSubmissionHistory
            submissions={submissions}
            statusFilter={submissionStatusFilter}
            sortBy={submissionSort}
            onStatusFilterChange={setSubmissionStatusFilter}
            onSortChange={setSubmissionSort}
          />
        )}

        {/* Contests Tab Content */}
        {activeTab === 'contests' && (
          <UserContestHistory contests={contests} ratingHistory={ratingHistory} />
        )}

        {/* Achievements Tab Content */}
        {activeTab === 'achievements' && (
          <UserAchievements userId={userId} />
        )}
      </div>
    </div>
  );
}
