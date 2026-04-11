'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Submission {
  id: string;
  code: string;
  language: string;
  status: string;
  submittedAt: string;
}

interface SubmissionComparisonProps {
  submission1?: Submission;
  submission2?: Submission;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SubmissionComparison Component - Compare two submissions
 */
export function SubmissionComparison({
  submission1,
  submission2,
  isOpen,
  onClose,
}: SubmissionComparisonProps) {
  if (!isOpen || !submission1 || !submission2) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        data-testid="submission-comparison-view"
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submission Comparison</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* First Submission */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            {/* Title */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">
                Version 1: {new Date(submission1.submittedAt).toLocaleString()}
              </h3>
              <p className="text-xs text-gray-600">
                Status: <span className="font-semibold">{submission1.status}</span>
              </p>
            </div>

            {/* Code */}
            <pre className="flex-1 overflow-y-auto bg-gray-900 text-gray-100 p-4 text-xs font-mono">
              {submission1.code}
            </pre>
          </div>

          {/* Second Submission */}
          <div className="flex-1 flex flex-col">
            {/* Title */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">
                Version 2: {new Date(submission2.submittedAt).toLocaleString()}
              </h3>
              <p className="text-xs text-gray-600">
                Status: <span className="font-semibold">{submission2.status}</span>
              </p>
            </div>

            {/* Code */}
            <pre className="flex-1 overflow-y-auto bg-gray-900 text-gray-100 p-4 text-xs font-mono">
              {submission2.code}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
