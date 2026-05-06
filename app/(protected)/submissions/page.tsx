'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SubmissionList,
  SubmissionStatsDisplay,
  LanguageChart,
  SubmissionTimeline,
  SubmissionDetailsModal,
  SubmissionComparison,
} from '@/components/submissions';
import { Submission } from '@/types';

// interface Submission removed and imported instead

interface SubmissionStats {
  totalSubmissions: number;
  acceptedSubmissions: number;
  rejectedSubmissions: number;
  acceptanceRate: number;
  averageScore: number;
  languageBreakdown: { [language: string]: number };
  successRatio: number;
  totalTime: number;
  averageTimePerProblem: number;
}

interface TimelineEntry {
  date: string;
  submissions: number;
  accepted: number;
}

/**
 * Submission History Page - Comprehensive dashboard for user submissions
 */
export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sort
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [reportOpen, setReportOpen] = useState(false);

  const pageSize = 10;

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          sortBy,
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
          ...(searchQuery && { search: searchQuery }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        const res = await fetch(`/api/users/profile/submissions?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch submissions');

        const data = await res.json();
        setSubmissions(data.submissions);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [page, statusFilter, searchQuery, sortBy, startDate, endDate, router]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const res = await fetch('/api/users/profile/submissions/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch stats');

        const data = await res.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Fetch timeline
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const res = await fetch('/api/users/profile/submissions/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch timeline');

        const data = await res.json();
        setTimeline(data.timeline);
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
      }
    };

    fetchTimeline();
  }, []);

  // Fetch submission details
  const fetchSubmissionDetails = async (submissionId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const res = await fetch(`/api/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch submission details');

      const data = await res.json();
      setSelectedSubmission(data.submission);
    } catch (err) {
      console.error('Failed to fetch submission details:', err);
    }
  };

  const handleSubmissionClick = (submission: Submission) => {
    fetchSubmissionDetails(submission.id);
  };

  const handleRetrySubmission = () => {
    if (selectedSubmission) {
      router.push(`/problems/${selectedSubmission.problemId}`);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const res = await fetch('/api/users/profile/submissions/export', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to export');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  };

  const handleCompareSubmissions = () => {
    if (selectedSubmissions.length === 2) {
      setComparisonOpen(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-red-600 font-semibold">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission History</h1>
          <p className="text-gray-600">
            Track, analyze, and compare your competitive programming submissions
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-8">
            <SubmissionStatsDisplay stats={stats} />
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="mb-8">
            <SubmissionTimeline timeline={timeline} />
          </div>
        )}

        {/* Language Chart */}
        {stats && (
          <div className="mb-8">
            <LanguageChart languageBreakdown={stats.languageBreakdown} />
          </div>
        )}

        {/* Submission List */}
        <div className="mb-8 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <SubmissionList
              submissions={submissions}
              total={total}
              page={page}
              pageSize={pageSize}
              isLoading={isLoading}
              onPageChange={setPage}
              onSubmissionClick={handleSubmissionClick}
              onStatusFilterChange={setStatusFilter}
              onSearchChange={setSearchQuery}
              onSort={setSortBy}
            />
          </div>
        </div>

        {/* Comparison Button */}
        {selectedSubmissions.length === 2 && (
          <div className="mb-8 flex justify-center">
            <button
              data-testid="compare-submissions-btn"
              onClick={handleCompareSubmissions}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Compare Selected Submissions
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <SubmissionDetailsModal
          submissionId={selectedSubmission.id}
          code={selectedSubmission.code || ''}
          language={selectedSubmission.language}
          status={selectedSubmission.status}
          testResults={selectedSubmission.testResults || []}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onRetry={handleRetrySubmission}
        />
      )}

      {/* Comparison View */}
      {comparisonOpen && selectedSubmissions.length === 2 && (
        <SubmissionComparison
          submission1={submissions.find((s) => s.id === selectedSubmissions[0])}
          submission2={submissions.find((s) => s.id === selectedSubmissions[1])}
          isOpen={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
        />
      )}
    </div>
  );
}
