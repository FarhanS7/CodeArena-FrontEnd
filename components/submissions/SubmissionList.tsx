'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, BarChart3 } from 'lucide-react';
import { Submission } from '@/types';

interface SubmissionListProps {
  submissions: Submission[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSubmissionClick: (submission: Submission) => void;
  onStatusFilterChange?: (status: string) => void;
  onSearchChange?: (query: string) => void;
  onSort?: (sortBy: string) => void;
}

const statusColors: { [key: string]: string } = {
  ACCEPTED: 'bg-green-50 text-green-800 border-green-200',
  WRONG_ANSWER: 'bg-red-50 text-red-800 border-red-200',
  TIME_LIMIT_EXCEEDED: 'bg-orange-50 text-orange-800 border-orange-200',
  COMPILATION_ERROR: 'bg-purple-50 text-purple-800 border-purple-200',
  RUNTIME_ERROR: 'bg-pink-50 text-pink-800 border-pink-200',
  PARTIAL: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

const difficultyColors: { [key: string]: string } = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800',
};

/**
 * SubmissionList Component - Display paginated submissions with filtering/sorting
 */
export function SubmissionList({
  submissions,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onSubmissionClick,
  onStatusFilterChange,
  onSearchChange,
  onSort,
}: SubmissionListProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 flex gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by problem title..."
            data-testid="submission-search"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            data-testid="status-filter"
            onChange={(e) => onStatusFilterChange?.(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option data-testid="filter-option-ACCEPTED" value="ACCEPTED">
              Accepted
            </option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
            <option value="TIME_LIMIT_EXCEEDED">TLE</option>
            <option value="COMPILATION_ERROR">Compilation Error</option>
            <option value="RUNTIME_ERROR">Runtime Error</option>
          </select>
        </div>

        {/* Export & Report Buttons */}
        <div className="flex gap-2">
          <button
            data-testid="export-csv-btn"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            data-testid="generate-report-btn"
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <BarChart3 className="w-4 h-4" />
            Report
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
        <label className="text-sm font-medium">Date Range:</label>
        <input
          type="date"
          data-testid="date-start"
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        />
        <span>to</span>
        <input
          type="date"
          data-testid="date-end"
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        />
        <button
          data-testid="date-filter-apply"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          data-testid="date-filter"
          className="ml-auto text-sm text-blue-600 hover:underline"
        >
          Clear
        </button>
      </div>

      {/* Pagination Info */}
      <div className="text-sm text-gray-600" data-testid="pagination-info">
        Showing {startIdx} - {endIdx} of {total} submissions
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full" data-testid="submission-list">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                <input type="checkbox" />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-200"
                onClick={() => onSort?.('date')}
                data-testid="sort-by-date"
              >
                Date ↓
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Problem
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Difficulty
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-200"
                onClick={() => onSort?.('language')}
                data-testid="sort-by-language"
              >
                Language
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-200"
                onClick={() => onSort?.('score')}
                data-testid="sort-by-score"
              >
                Score ↓
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Runtime
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Memory
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Loading submissions...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr
                  key={submission.id}
                  data-testid="submission-row"
                  onClick={() => onSubmissionClick(submission)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      data-testid={`select-submission-${submission.id}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(submission.submittedAt).toLocaleDateString()}{' '}
                    {new Date(submission.submittedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{submission.problemTitle}</td>
                  <td className="px-4 py-3">
                    <span
                      data-testid="submission-status-badge"
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[submission.status]}`}
                    >
                      {submission.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {submission.difficulty ? (
                      <span
                        data-testid={`difficulty-badge-${submission.difficulty}`}
                        className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[submission.difficulty]}`}
                      >
                        {submission.difficulty}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{submission.language}</td>
                  <td className="px-4 py-3 text-sm font-medium">{submission.score}</td>
                  <td className="px-4 py-3 text-sm">
                    {submission.verdict ? (
                      <div>
                        <span data-testid="runtime-ms">{submission.verdict.runtime}ms</span>
                        <span className="text-gray-500 text-xs ml-1" data-testid="runtime-percentile">
                          ({submission.verdict.runtimePercent}%)
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {submission.verdict ? (
                      <div>
                        <span data-testid="memory-mb">{submission.verdict.memory.toFixed(1)}MB</span>
                        <span className="text-gray-500 text-xs ml-1" data-testid="memory-percentile">
                          ({submission.verdict.memoryPercent}%)
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between" data-testid="submission-pagination">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg ${
                  page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
