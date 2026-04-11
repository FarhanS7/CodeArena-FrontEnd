'use client';

import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

interface TestCase {
  id: number;
  status: 'PASSED' | 'FAILED';
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  time?: number;
  memory?: number;
  errorMessage?: string;
}

interface TestResults {
  totalTests: number;
  passedTests: number;
  testCases: TestCase[];
}

interface SubmissionStatusBadgeProps {
  status:
    | 'ACCEPTED'
    | 'WRONG_ANSWER'
    | 'PENDING'
    | 'COMPILATION_ERROR'
    | 'RUNTIME_ERROR'
    | 'TIME_LIMIT_EXCEEDED';
  testResults?: TestResults;
  compilationError?: string;
  runtimeError?: string;
}

const statusColors: Record<string, string> = {
  ACCEPTED: 'bg-green-500 text-white',
  WRONG_ANSWER: 'bg-red-500 text-white',
  PENDING: 'bg-yellow-500 text-black',
  COMPILATION_ERROR: 'bg-red-700 text-white',
  RUNTIME_ERROR: 'bg-orange-500 text-white',
  TIME_LIMIT_EXCEEDED: 'bg-purple-500 text-white',
};

const statusIcons: Record<string, React.ReactNode> = {
  ACCEPTED: <CheckCircle className="w-4 h-4" />,
  WRONG_ANSWER: <XCircle className="w-4 h-4" />,
  PENDING: <Loader2 className="w-4 h-4 animate-spin" />,
  COMPILATION_ERROR: <AlertCircle className="w-4 h-4" />,
  RUNTIME_ERROR: <AlertCircle className="w-4 h-4" />,
  TIME_LIMIT_EXCEEDED: <Clock className="w-4 h-4" />,
};

export function SubmissionStatusBadge({
  status,
  testResults,
  compilationError,
  runtimeError,
}: SubmissionStatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-500 text-white';

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div
        data-testid="status-badge"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${colorClass}`}
      >
        {statusIcons[status]}
        <span>{status}</span>
      </div>

      {/* Test Results Breakdown */}
      {testResults && (
        <div className="space-y-2 mt-4 p-4 bg-slate-900 rounded-lg">
          <div
            data-testid="passed-count"
            className="text-sm font-semibold text-slate-300 mb-3"
          >
            Tests Passed: {testResults.passedTests}/{testResults.totalTests}
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.testCases.map((tc, idx) => (
              <div
                key={idx}
                data-testid={`test-case-${idx}`}
                className={`p-2 rounded text-xs font-mono space-y-1 ${
                  tc.status === 'PASSED'
                    ? 'bg-green-900 text-green-400'
                    : 'bg-red-900 text-red-400'
                }`}
              >
                <div className="font-bold">
                  Test {tc.id}: {tc.status}
                </div>
                <div className="text-xs opacity-75">
                  Input: {tc.input}
                </div>
                <div className="text-xs opacity-75">
                  Expected: {tc.expectedOutput}
                </div>
                {tc.actualOutput && (
                  <div className="text-xs opacity-75">
                    Actual: {tc.actualOutput}
                  </div>
                )}
                {tc.time && (
                  <div className="text-xs opacity-75">
                    Time: {tc.time}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compilation Error Display */}
      {compilationError && status === 'COMPILATION_ERROR' && (
        <div
          data-testid="error-display"
          className="p-4 bg-red-900 rounded-lg text-red-200 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto"
        >
          {compilationError}
        </div>
      )}

      {/* Runtime Error Display */}
      {runtimeError && status === 'RUNTIME_ERROR' && (
        <div
          data-testid="error-display"
          className="p-4 bg-orange-900 rounded-lg text-orange-200 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto"
        >
          {runtimeError}
        </div>
      )}
    </div>
  );
}
