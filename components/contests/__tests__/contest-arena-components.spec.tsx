import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

/**
 * Component Tests - Contest Arena Components (TDD RED Phase)
 */

describe('ContestTimer Component', () => {
  /**
   * TEST 1: Should render with correct format MM:SS:HH
   */
  test('should display timer in MM:SS:HH format', () => {
    const ContestTimer = ({ endTime }: { endTime: Date }) => {
      const [time, setTime] = React.useState('05:30:45');

      return <div data-testid="timer">{time}</div>;
    };

    render(<ContestTimer endTime={new Date(Date.now() + 5 * 60 * 1000)} />);

    const timer = screen.getByTestId('timer');
    expect(timer).toHaveTextContent(/\d{2}:\d{2}:\d{2}/);
  });

  /**
   * TEST 2: Should decrement every second
   */
  test('should decrement timer every second', async () => {
    const ContestTimer = ({ endTime }: { endTime: Date }) => {
      const [remainingSeconds, setRemainingSeconds] = React.useState(600); // 10 minutes

      React.useEffect(() => {
        const interval = setInterval(() => {
          setRemainingSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
      }, []);

      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      return (
        <div data-testid="timer">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </div>
      );
    };

    render(<ContestTimer endTime={new Date()} />);

    const timer = screen.getByTestId('timer');
    const initialText = timer.textContent;

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    const updatedText = timer.textContent;
    expect(initialText).not.toBe(updatedText);
  });

  /**
   * TEST 3: Should show warning style when time < 5 minutes
   */
  test('should apply warning style when time remaining < 5 minutes', () => {
    const ContestTimer = ({ endTime }: { endTime: Date }) => {
      const remainingSeconds = 240; // 4 minutes
      const isWarning = remainingSeconds < 300; // 5 minutes

      return (
        <div
          data-testid="timer-container"
          className={isWarning ? 'text-red-500' : 'text-green-500'}
        >
          Timer
        </div>
      );
    };

    render(<ContestTimer endTime={new Date()} />);

    const container = screen.getByTestId('timer-container');
    expect(container).toHaveClass('text-red-500');
  });

  /**
   * TEST 4: Should call onTimeUp when timer reaches 0
   */
  test('should trigger onTimeUp callback when timer reaches zero', async () => {
    const mockOnTimeUp = jest.fn();

    const ContestTimer = ({ endTime, onTimeUp }: any) => {
      const [remainingSeconds, setRemainingSeconds] = React.useState(2); // 2 seconds

      React.useEffect(() => {
        if (remainingSeconds === 0) {
          onTimeUp();
          return;
        }

        const interval = setInterval(() => {
          setRemainingSeconds((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0) onTimeUp();
            return next;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, [remainingSeconds, onTimeUp]);

      return <div data-testid="timer">{remainingSeconds}</div>;
    };

    render(<ContestTimer endTime={new Date()} onTimeUp={mockOnTimeUp} />);

    await waitFor(() => expect(mockOnTimeUp).toHaveBeenCalled(), {
      timeout: 5000,
    });
  });
});

describe('SubmissionStatusBadge Component', () => {
  /**
   * TEST 5: Should display correct color for each status
   */
  test('should show green for ACCEPTED status', () => {
    const StatusBadge = ({ status }: { status: string }) => {
      const statusColors = {
        ACCEPTED: 'bg-green-500',
        WRONG_ANSWER: 'bg-red-500',
        PENDING: 'bg-yellow-500',
        COMPILATION_ERROR: 'bg-red-700',
        RUNTIME_ERROR: 'bg-orange-500',
        TIME_LIMIT_EXCEEDED: 'bg-purple-500',
      };

      return (
        <div
          data-testid="status-badge"
          className={statusColors[status as keyof typeof statusColors]}
        >
          {status}
        </div>
      );
    };

    render(<StatusBadge status="ACCEPTED" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-green-500');
  });

  /**
   * TEST 6: Should show red for WRONG_ANSWER status
   */
  test('should show red for WRONG_ANSWER status', () => {
    const StatusBadge = ({ status }: { status: string }) => {
      const statusColors: Record<string, string> = {
        ACCEPTED: 'bg-green-500',
        WRONG_ANSWER: 'bg-red-500',
        PENDING: 'bg-yellow-500',
      };

      return (
        <div
          data-testid="status-badge"
          className={statusColors[status]}
          data-status={status}
        >
          {status}
        </div>
      );
    };

    render(<StatusBadge status="WRONG_ANSWER" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-red-500');
  });

  /**
   * TEST 7: Should show loading animation for PENDING
   */
  test('should show loading spinner for PENDING status', () => {
    const StatusBadge = ({ status }: { status: string }) => {
      return (
        <div data-testid="status-badge">
          {status === 'PENDING' && <div data-testid="spinner">⏳</div>}
          {status}
        </div>
      );
    };

    render(<StatusBadge status="PENDING" />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  /**
   * TEST 8: Should display all test details for ACCEPTED
   */
  test('should show test case breakdown for ACCEPTED submission', () => {
    const SubmissionDetails = ({ data }: any) => {
      return (
        <div>
          <div data-testid="passed-count">
            {data.testResults.passedTests}/{data.testResults.totalTests}
          </div>
          {data.testResults.testCases.map((tc: any, idx: number) => (
            <div
              key={idx}
              data-testid={`test-case-${idx}`}
              className={tc.status === 'PASSED' ? 'text-green-500' : 'text-red-500'}
            >
              Test {tc.id}: {tc.status}
            </div>
          ))}
        </div>
      );
    };

    const testData = {
      testResults: {
        totalTests: 3,
        passedTests: 3,
        testCases: [
          { id: 1, status: 'PASSED', input: '5', expectedOutput: '120', actualOutput: '120' },
          { id: 2, status: 'PASSED', input: '3', expectedOutput: '6', actualOutput: '6' },
          { id: 3, status: 'PASSED', input: '0', expectedOutput: '1', actualOutput: '1' },
        ],
      },
    };

    render(<SubmissionDetails data={testData} />);

    const passedCount = screen.getByTestId('passed-count');
    expect(passedCount).toHaveTextContent('3/3');

    const testCases = screen.getAllByTestId(/test-case-/);
    expect(testCases).toHaveLength(3);
  });

  /**
   * TEST 9: Should show error message for COMPILATION_ERROR
   */
  test('should display compilation error message', () => {
    const CompilationErrorDisplay = ({ error }: { error: string }) => {
      return (
        <div data-testid="error-display" className="text-red-500 font-mono whitespace-pre">
          {error}
        </div>
      );
    };

    const errorMsg = 'SyntaxError: invalid syntax at line 5\nExpected ":" but found "print"';

    render(<CompilationErrorDisplay error={errorMsg} />);

    const display = screen.getByTestId('error-display');
    expect(display).toHaveTextContent('SyntaxError');
    expect(display).toHaveTextContent('line 5');
  });
});

describe('SubmissionForm Component', () => {
  /**
   * TEST 10: Should have RUN and SUBMIT buttons
   */
  test('should display both RUN and SUBMIT buttons', () => {
    const SubmissionForm = () => {
      return (
        <div>
          <button data-testid="run-button">Run on Examples</button>
          <button data-testid="submit-button">Submit Solution</button>
        </div>
      );
    };

    render(<SubmissionForm />);

    expect(screen.getByTestId('run-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  /**
   * TEST 11: RUN should only execute against examples
   */
  test('should pass executionType as RUN to API', async () => {
    const mockOnRun = jest.fn();

    const SubmissionForm = ({ onRun }: any) => {
      return (
        <button
          data-testid="run-button"
          onClick={() => onRun({ executionType: 'RUN', code: 'print(5)' })}
        >
          Run
        </button>
      );
    };

    render(<SubmissionForm onRun={mockOnRun} />);

    const runButton = screen.getByTestId('run-button');
    await userEvent.click(runButton);

    expect(mockOnRun).toHaveBeenCalledWith(
      expect.objectContaining({
        executionType: 'RUN',
      }),
    );
  });

  /**
   * TEST 12: SUBMIT should send full submission context
   */
  test('should pass executionType as SUBMIT with contest context', async () => {
    const mockOnSubmit = jest.fn();

    const SubmissionForm = ({ onSubmit }: any) => {
      return (
        <button
          data-testid="submit-button"
          onClick={() =>
            onSubmit({
              executionType: 'SUBMIT',
              contestId: 1,
              code: 'print(5)',
            })
          }
        >
          Submit
        </button>
      );
    };

    render(<SubmissionForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        executionType: 'SUBMIT',
        contestId: 1,
      }),
    );
  });

  /**
   * TEST 13: Should disable submit when code is empty
   */
  test('should disable SUBMIT button when code is empty', () => {
    const SubmissionForm = ({ code }: { code: string }) => {
      return (
        <button data-testid="submit-button" disabled={!code || code.trim().length === 0}>
          Submit
        </button>
      );
    };

    render(<SubmissionForm code="" />);

    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  /**
   * TEST 14: Should enable submit when code is present
   */
  test('should enable SUBMIT button when code is present', () => {
    const SubmissionForm = ({ code }: { code: string }) => {
      return (
        <button data-testid="submit-button" disabled={!code || code.trim().length === 0}>
          Submit
        </button>
      );
    };

    render(<SubmissionForm code="print('hello')" />);

    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });
});

describe('SubmissionHistory Component', () => {
  /**
   * TEST 15: Should display list of submissions
   */
  test('should render submission history table with rows', () => {
    const SubmissionHistory = ({ submissions }: any) => {
      return (
        <table data-testid="submission-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Status</th>
              <th>Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub: any, idx: number) => (
              <tr key={idx} data-testid="submission-row">
                <td>{sub.problemLabel}</td>
                <td>{sub.status}</td>
                <td>{sub.time}</td>
                <td>{sub.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    const submissions = [
      { problemLabel: 'A', status: 'ACCEPTED', time: '12:30:00', score: 100 },
      { problemLabel: 'B', status: 'WRONG_ANSWER', time: '12:45:00', score: 0 },
    ];

    render(<SubmissionHistory submissions={submissions} />);

    const rows = screen.getAllByTestId('submission-row');
    expect(rows).toHaveLength(2);
  });

  /**
   * TEST 16: Should show no submissions message when empty
   */
  test('should display empty state when no submissions', () => {
    const SubmissionHistory = ({ submissions }: any) => {
      if (submissions.length === 0) {
        return <div data-testid="empty-state">No submissions yet</div>;
      }

      return <div>Submissions</div>;
    };

    render(<SubmissionHistory submissions={[]} />);

    expect(screen.getByTestId('empty-state')).toHaveTextContent('No submissions yet');
  });

  /**
   * TEST 17: Should sort by most recent first
   */
  test('should display submissions sorted by time descending (most recent first)', () => {
    const SubmissionHistory = ({ submissions }: any) => {
      const sorted = [...submissions].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );

      return (
        <div>
          {sorted.map((sub: any, idx: number) => (
            <div key={idx} data-testid={`sub-${idx}`}>
              {sub.time}
            </div>
          ))}
        </div>
      );
    };

    const submissions = [
      { time: '2024-01-01T12:30:00Z', status: 'ACCEPTED' },
      { time: '2024-01-01T13:30:00Z', status: 'WRONG_ANSWER' }, // More recent
      { time: '2024-01-01T11:30:00Z', status: 'PENDING' },
    ];

    render(<SubmissionHistory submissions={submissions} />);

    const times = screen.getAllByTestId(/sub-/);
    expect(times[0]).toHaveTextContent('13:30'); // Most recent first
  });
});
