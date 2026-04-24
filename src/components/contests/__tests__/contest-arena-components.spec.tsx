import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContestTimer } from '../ContestTimer';
import { SubmissionStatusBadge } from '../SubmissionStatusBadge';
import { SubmissionForm } from '../SubmissionForm';
import { SubmissionHistory } from '../SubmissionHistory';

/**
 * Component Tests - Contest Arena
 * Tests individual components with React Testing Library
 */

describe('ContestTimer Component', () => {
  it('should render timer in MM:SS:HH format', () => {
    const endTime = new Date(Date.now() + 3600000); // 1 hour from now
    render(<ContestTimer endTime={endTime} />);

    const timerContainer = screen.getByTestId('timer-container');
    expect(timerContainer).toBeInTheDocument();

    const timerValue = screen.getByTestId('timer');
    expect(timerValue).toBeInTheDocument();

    // Should match HH:MM:SS format
    const timeText = timerValue.textContent;
    expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('should decrement timer every second', async () => {
    const endTime = new Date(Date.now() + 3600000);
    render(<ContestTimer endTime={endTime} />);

    const timerValue = screen.getByTestId('timer');
    const initialTime = timerValue.textContent;

    // Wait 1.1 seconds for update
    await waitFor(
      () => {
        expect(timerValue.textContent).not.toBe(initialTime);
      },
      { timeout: 2000 },
    );
  });

  it('should show warning class when time < 5 minutes', async () => {
    const endTime = new Date(Date.now() + 240000); // 4 minutes
    render(<ContestTimer endTime={endTime} />);

    const timerContainer = screen.getByTestId('timer-container');

    await waitFor(
      () => {
        expect(timerContainer).toHaveClass('text-red-500');
      },
      { timeout: 1000 },
    );
  });

  it('should call onTimeUp when timer reaches zero', async () => {
    const onTimeUp = jest.fn();
    const endTime = new Date(Date.now() + 500); // 500ms

    render(<ContestTimer endTime={endTime} onTimeUp={onTimeUp} />);

    await waitFor(
      () => {
        expect(onTimeUp).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });
});

describe('SubmissionStatusBadge Component', () => {
  it('should display ACCEPTED with green color', () => {
    render(<SubmissionStatusBadge status="ACCEPTED" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveTextContent('ACCEPTED');
    expect(badge).toHaveClass('bg-green-500');
  });

  it('should display WRONG_ANSWER with red color', () => {
    render(<SubmissionStatusBadge status="WRONG_ANSWER" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveTextContent('WRONG ANSWER');
    expect(badge).toHaveClass('bg-red-500');
  });

  it('should display PENDING with spinner', () => {
    render(<SubmissionStatusBadge status="PENDING" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveTextContent('PENDING');

    // Should contain a loading spinner (animating)
    const svgIcon = badge.querySelector('svg');
    expect(svgIcon).toHaveClass('animate-spin');
  });

  it('should display compilation error message', () => {
    const errorMsg = 'SyntaxError: invalid syntax at line 1';
    render(
      <SubmissionStatusBadge status="COMPILATION_ERROR" errorMessage={errorMsg} />,
    );

    const error = screen.getByTestId('error-display');
    expect(error).toHaveTextContent(errorMsg);
  });

  it('should display TLE status with yellow color', () => {
    render(<SubmissionStatusBadge status="TIME_LIMIT_EXCEEDED" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-yellow-500');
  });

  it('should display runtime error message', () => {
    const errorMsg = 'ZeroDivisionError: division by zero';
    render(
      <SubmissionStatusBadge status="RUNTIME_ERROR" errorMessage={errorMsg} />,
    );

    const error = screen.getByTestId('error-display');
    expect(error).toHaveTextContent(errorMsg);
  });
});

describe('SubmissionForm Component', () => {
  it('should render RUN and SUBMIT buttons', () => {
    render(
      <SubmissionForm
        code=""
        language="python"
        contestId="1"
        onRun={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    const runButton = screen.getByTestId('run-button');
    const submitButton = screen.getByTestId('submit-button');

    expect(runButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should disable SUBMIT button when code is empty', () => {
    render(
      <SubmissionForm
        code=""
        language="python"
        contestId="1"
        onRun={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('should enable SUBMIT button when code is present', () => {
    render(
      <SubmissionForm
        code="print('hello')"
        language="python"
        contestId="1"
        onRun={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onRun with correct context when RUN clicked', async () => {
    const user = userEvent.setup();
    const onRun = jest.fn();

    render(
      <SubmissionForm
        code="print(42)"
        language="python"
        contestId="1"
        onRun={onRun}
        onSubmit={jest.fn()}
      />,
    );

    const runButton = screen.getByTestId('run-button');
    await user.click(runButton);

    expect(onRun).toHaveBeenCalledWith({
      executionType: 'RUN',
      code: 'print(42)',
      language: 'python',
    });
  });

  it('should call onSubmit with full context when SUBMIT clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <SubmissionForm
        code="print(42)"
        language="java"
        contestId="1"
        problemId="123"
        onRun={jest.fn()}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      executionType: 'SUBMIT',
      code: 'print(42)',
      language: 'java',
      contestId: '1',
      problemId: '123',
    });
  });
});

describe('SubmissionHistory Component', () => {
  it('should display empty state when no submissions', () => {
    render(<SubmissionHistory submissions={[]} />);

    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveTextContent('No submissions yet');
  });

  it('should display submission rows for each submission', () => {
    const submissions = [
      {
        id: '1',
        status: 'ACCEPTED',
        language: 'python',
        submittedAt: new Date(),
      },
      {
        id: '2',
        status: 'WRONG_ANSWER',
        language: 'java',
        submittedAt: new Date(),
      },
    ];

    render(<SubmissionHistory submissions={submissions} />);

    const rows = screen.getAllByTestId('submission-row');
    expect(rows).toHaveLength(2);
  });

  it('should sort submissions by most recent first', () => {
    const now = new Date();
    const submissions = [
      {
        id: '1',
        status: 'ACCEPTED',
        language: 'python',
        submittedAt: new Date(now.getTime() - 10000),
      },
      {
        id: '2',
        status: 'WRONG_ANSWER',
        language: 'java',
        submittedAt: new Date(now.getTime() - 5000),
      },
    ];

    render(<SubmissionHistory submissions={submissions} />);

    const rows = screen.getAllByTestId('submission-row');

    // Most recent (id: 2) should be first
    expect(rows[0]).toHaveTextContent('WRONG_ANSWER');
    expect(rows[1]).toHaveTextContent('ACCEPTED');
  });

  it('should display submission details in table', () => {
    const submissions = [
      {
        id: '1',
        status: 'ACCEPTED',
        language: 'python',
        submittedAt: new Date('2024-01-01T12:00:00'),
      },
    ];

    render(<SubmissionHistory submissions={submissions} />);

    const row = screen.getByTestId('submission-row');

    expect(row).toHaveTextContent('ACCEPTED');
    expect(row).toHaveTextContent('python');
    expect(row).toHaveTextContent('12:00');
  });

  it('should auto-refresh every 5 seconds', async () => {
    jest.useFakeTimers();
    const onRefresh = jest.fn();
    const submissions = [];

    render(<SubmissionHistory submissions={submissions} onRefresh={onRefresh} />);

    // Fast-forward 5 seconds
    jest.advanceTimersByTime(5000);

    expect(onRefresh).toHaveBeenCalled();

    jest.useRealTimers();
  }, 10000);
});
