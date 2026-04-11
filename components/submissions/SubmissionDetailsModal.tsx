'use client';

import React from 'react';
import { X } from 'lucide-react';

interface TestResult {
  testCase: number;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL';
  stderr: string;
}

interface SubmissionDetailsModalProps {
  submissionId: string;
  code: string;
  language: string;
  status: string;
  testResults: TestResult[];
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

/**
 * SubmissionDetailsModal Component - Show detailed submission verdict
 */
export function SubmissionDetailsModal({
  submissionId,
  code,
  language,
  status,
  testResults,
  isOpen,
  onClose,
  onRetry,
}: SubmissionDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        data-testid="submission-details-modal"
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-96 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Submission ID</p>
              <p className="font-mono text-sm font-semibold">{submissionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Language</p>
              <p className="font-semibold">{language}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-semibold ${status === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'}`}>
                {status}
              </p>
            </div>
          </div>

          {/* Code */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Code</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {code}
            </pre>
          </div>

          {/* Test Results */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result) => (
                <div
                  key={result.testCase}
                  data-testid={`test-result-${result.testCase}`}
                  className={`p-3 rounded-lg border-2 ${
                    result.status === 'PASS'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Test Case {result.testCase}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        result.status === 'PASS'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    {result.status === 'FAIL' && (
                      <>
                        <div className="text-gray-700">
                          Expected: <span className="font-mono text-xs">{result.expected}</span>
                        </div>
                        <div className="text-gray-700">
                          Actual: <span className="font-mono text-xs">{result.actual}</span>
                        </div>
                      </>
                    )}
                    {result.stderr && (
                      <div className="text-red-600">
                        Error: <span className="font-mono text-xs">{result.stderr}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
          <button
            data-testid="retry-submission-btn"
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Retry Submission
          </button>
        </div>
      </div>
    </div>
  );
}
