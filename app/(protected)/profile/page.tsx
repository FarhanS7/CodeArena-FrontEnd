'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/components/profile';

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

/**
 * User Profile Page - Display current user's profile
 * Fetches user profile, stats, submissions, and contests from real backend API
 */
export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [ratingHistory, setRatingHistory] = useState<RatingHistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch user profile
        const profileRes = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileRes.json();
        setUser(profileData.user);

        // Fetch user stats
        const statsRes = await fetch('/api/users/profile/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData.stats);

        // Fetch submissions
        const submissionsRes = await fetch('/api/users/profile/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!submissionsRes.ok) throw new Error('Failed to fetch submissions');
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData.submissions);

        // Fetch contests
        const contestsRes = await fetch('/api/users/profile/contests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!contestsRes.ok) throw new Error('Failed to fetch contests');
        const contestsData = await contestsRes.json();
        setContests(contestsData.contests);

        // Fetch rating history
        const ratingRes = await fetch('/api/users/profile/rating-history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ratingRes.ok) throw new Error('Failed to fetch rating history');
        const ratingData = await ratingRes.json();
        setRatingHistory(ratingData.history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserProfile
      userId={user.id}
      user={user}
      stats={stats}
      submissions={submissions}
      contests={contests}
      ratingHistory={ratingHistory}
      isOwnProfile={true}
      onEditProfile={handleEditProfile}
    />
  );
}
