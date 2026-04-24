import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface TestCase {
  id: number;
  status: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

interface TestResults {
  totalTests: number;
  passedTests: number;
  testCases?: TestCase[];
}

interface SubmissionStatusBadgeProps {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'PENDING' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED';
  testResults?: TestResults;
  compilationError?: string;
  runtimeError?: string;
}

/**
 * Submission Status Badge - Visual status indicator
 * Shows color-coded status with optional error details and test results
 */
export function SubmissionStatusBadge({
  status,
  testResults,
  compilationError,
  runtimeError,
}: SubmissionStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ACCEPTED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-500',
          text: 'ACCEPTED',
        };
      case 'WRONG_ANSWER':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-red-500',
          text: 'WRONG ANSWER',
        };
      case 'PENDING':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          color: 'bg-yellow-500',
          text: 'PENDING',
        };
      case 'COMPILATION_ERROR':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-red-600',
          text: 'COMPILATION ERROR',
        };
      case 'RUNTIME_ERROR':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-red-600',
          text: 'RUNTIME ERROR',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-500',
          text: 'TIME LIMIT',
        };
      default:
        return {
          icon: null,
          color: 'bg-gray-500',
          text: 'UNKNOWN',
        };
    }
  };

  const config = getStatusConfig();
  const errorMsg = compilationError || runtimeError;

  return (
    <div className="space-y-3">
      <div
        data-testid="status-badge"
        className={`${config.color} text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 w-fit`}
      >
        {config.icon}
        {config.text}
      </div>

      {/* Test Results Summary */}
      {testResults && (
        <div className="text-xs text-slate-400 space-y-1">
          <div>
            Passed: <span className="text-emerald-400 font-semibold">{testResults.passedTests}/{testResults.totalTests}</span>
          </div>
          {testResults.testCases && testResults.testCases.length > 0 && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {testResults.testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className={`text-[11px] p-1.5 rounded border ${
                    tc.status === 'PASSED'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <span className="font-mono">Test {idx + 1}: {tc.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {errorMsg && (
        <div
          data-testid="error-display"
          className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-mono whitespace-pre-wrap break-words max-w-md"
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}
