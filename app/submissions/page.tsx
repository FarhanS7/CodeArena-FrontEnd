'use client';

import React, { useState, useEffect } from 'react';
import {
  SubmissionList,
  SubmissionStatsDisplay,
  LanguageChart,
  SubmissionTimeline,
  SubmissionDetailsModal,
  SubmissionComparison,
} from '@/components/submissions';

interface DashboardStats {
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

interface Submission {
  id: string;
  problemId: number;
  problemTitle: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'PARTIAL';
  language: string;
  submittedAt: string;
  score: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  verdict?: {
    runtime: number;
    memory: number;
    runtimePercent: number;
    memoryPercent: number;
  };
}

/**
 * SubmissionHistory Page - Complete submission tracking dashboard
 */
export default function SubmissionHistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonSubmission1, setComparisonSubmission1] = useState<Submission | null>(null);
  const [comparisonSubmission2, setComparisonSubmission2] = useState<Submission | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchSubmissionData();
  }, [page, statusFilter, searchQuery, sortBy]);

  async function fetchSubmissionData() {
    setLoading(true);
    try {
      // Fetch submissions with filters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
        sortBy,
      });

      const [submissionsRes, statsRes, timelineRes] = await Promise.all([
        fetch(`/api/submissions?${params}`),
        fetch('/api/submissions/stats'),
        fetch('/api/submissions/timeline?days=7'),
      ]);

      if (!submissionsRes.ok || !statsRes.ok || !timelineRes.ok) throw new Error('Failed to fetch');

      const submissionsData = await submissionsRes.json();
      const statsData = await statsRes.json();
      const timelineData = await timelineRes.json();

      setSubmissions(submissionsData.data || []);
      setTotalSubmissions(submissionsData.total || 0);
      setStats(statsData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to fetch submission data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmissionClick(submission: Submission) {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  }

  function handleRetrySubmission() {
    // Navigate to problem with pre-filled code
    if (selectedSubmission) {
      // This would typically redirect to the editor page
      console.log('Retrying submission:', selectedSubmission.id);
    }
    setShowDetailsModal(false);
  }

  function handleCompareSubmissions() {
    if (comparisonSubmission1 && comparisonSubmission2) {
      setShowComparisonModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submission History</h1>
            <p className="text-gray-600 mt-1">Track your problem-solving progress and performance</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        {stats && (
          <section data-testid="stats-section">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
            <SubmissionStatsDisplay stats={stats} />
          </section>
        )}

        {/* Timeline and Language Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section data-testid="timeline-section">
            {timeline.length > 0 && <SubmissionTimeline timeline={timeline} />}
          </section>

          <section data-testid="language-chart-section">
            {stats && <LanguageChart languageBreakdown={stats.languageBreakdown} />}
          </section>
        </div>

        {/* Submission List */}
        <section data-testid="submission-list-section">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Submissions</h2>
          <SubmissionList
            submissions={submissions}
            total={totalSubmissions}
            page={page}
            pageSize={pageSize}
            isLoading={loading}
            onPageChange={setPage}
            onSubmissionClick={handleSubmissionClick}
            onStatusFilterChange={setStatusFilter}
            onSearchChange={setSearchQuery}
            onSort={setSortBy}
          />
        </section>
      </main>

      {/* Modals */}
      {selectedSubmission && (
        <SubmissionDetailsModal
          submissionId={selectedSubmission.id}
          code="// Code would be fetched from API"
          language={selectedSubmission.language}
          status={selectedSubmission.status}
          testResults={[]}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onRetry={handleRetrySubmission}
        />
      )}

      {comparisonSubmission1 && comparisonSubmission2 && (
        <SubmissionComparison
          submission1={comparisonSubmission1}
          submission2={comparisonSubmission2}
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
}
