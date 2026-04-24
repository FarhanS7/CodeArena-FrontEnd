import { renderHook, act, waitFor } from '@testing-library/react';
import { useVerdictSync } from '../useVerdictSync';

/**
 * Hook Tests - Submission Verdict Sync
 * Tests for real-time verdict updates and state synchronization
 */

describe('useVerdictSync Hook', () => {
  const mockSubmissionId = 'sub-123';

  it('should initialize with pending status', () => {
    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    expect(result.current.status).toBe('PENDING');
    expect(result.current.verdict).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should update status when verdict arrives', async () => {
    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'ACCEPTED',
        },
      }));
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ACCEPTED');
    });
  });

  it('should include test results in verdict', async () => {
    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    const testResults = {
      totalTests: 5,
      passedTests: 5,
      testCases: [
        { id: 1, status: 'PASSED' },
      ],
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'ACCEPTED',
          testResults,
        },
      }));
    });

    await waitFor(() => {
      expect(result.current.verdict?.testResults).toEqual(testResults);
    });
  });

  it('should include error message for compilation error', async () => {
    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    const errorMsg = 'SyntaxError: invalid syntax';

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'COMPILATION_ERROR',
          compilationError: errorMsg,
        },
      }));
    });

    await waitFor(() => {
      expect(result.current.verdict?.compilationError).toBe(errorMsg);
    });
  });

  it('should include error message for runtime error', async () => {
    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    const errorMsg = 'ZeroDivisionError: division by zero';

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'RUNTIME_ERROR',
          runtimeError: errorMsg,
        },
      }));
    });

    await waitFor(() => {
      expect(result.current.verdict?.runtimeError).toBe(errorMsg);
    });
  });

  it('should start polling if WebSocket times out', async () => {
    const pollSpy = jest.fn();

    jest.useFakeTimers();

    const { result } = renderHook(() => useVerdictSync(mockSubmissionId, { pollInterval: 1000 }));

    // Allow hook to attempt WebSocket
    act(() => {
      jest.advanceTimersByTime(5000); // WebSocket timeout
    });

    // Should start polling
    await waitFor(() => {
      expect(result.current.isPolling).toBe(true);
    });

    jest.useRealTimers();
  });

  it('should poll at specified interval', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useVerdictSync(mockSubmissionId, { pollInterval: 2000, wsTimeout: 1000 }),
    );

    // Skip WebSocket attempt
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Advance by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // At least one poll should have happened
    expect(result.current.pollAttempts).toBeGreaterThanOrEqual(1);

    jest.useRealTimers();
  });

  it('should stop polling when verdict received', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useVerdictSync(mockSubmissionId, { wsTimeout: 500 }),
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Should be polling
    await waitFor(() => {
      expect(result.current.isPolling).toBe(true);
    });

    // Simulate verdict arriving
    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'ACCEPTED',
        },
      }));
    });

    // Should stop polling
    await waitFor(() => {
      expect(result.current.isPolling).toBe(false);
    });

    jest.useRealTimers();
  });

  it('should retry on poll failure', async () => {
    let pollAttempts = 0;
    const mockFetch = jest.fn(async () => {
      pollAttempts++;
      if (pollAttempts < 3) {
        throw new Error('Network error');
      }
      return {
        ok: true,
        json: async () => ({ data: { status: 'ACCEPTED' } }),
      };
    });

    global.fetch = mockFetch;

    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useVerdictSync(mockSubmissionId, { wsTimeout: 100, maxRetries: 3 }),
    );

    // Wait through polling retries
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Eventually should succeed
    await waitFor(() => {
      expect(pollAttempts).toBeGreaterThanOrEqual(2);
    }, { timeout: 5000 });

    jest.useRealTimers();
  });

  it('should emit custom event on verdict update', async () => {
    const eventSpy = jest.fn();
    window.addEventListener('verdict-received', eventSpy);

    const { result } = renderHook(() => useVerdictSync(mockSubmissionId));

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: {
          submissionId: mockSubmissionId,
          status: 'ACCEPTED',
        },
      }));
    });

    await waitFor(() => {
      expect(eventSpy).toHaveBeenCalled();
    });

    const eventData = eventSpy.mock.calls[0][0].detail;
    expect(eventData.submissionId).toBe(mockSubmissionId);
    expect(eventData.status).toBe('ACCEPTED');

    window.removeEventListener('verdict-received', eventSpy);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useVerdictSync(mockSubmissionId));

    const cleanupSpy = jest.fn();
    window.addEventListener('verdict-update', cleanupSpy);

    unmount();

    // Should not receive new updates after unmount
    window.dispatchEvent(new CustomEvent('verdict-update', {
      detail: { submissionId: mockSubmissionId, status: 'ACCEPTED' },
    }));

    window.removeEventListener('verdict-update', cleanupSpy);
  });

  it('should handle multiple submissions in parallel', async () => {
    const { result: result1 } = renderHook(() => useVerdictSync('sub-1'));
    const { result: result2 } = renderHook(() => useVerdictSync('sub-2'));

    // Both start as PENDING
    expect(result1.current.status).toBe('PENDING');
    expect(result2.current.status).toBe('PENDING');

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: { submissionId: 'sub-1', status: 'ACCEPTED' },
      }));
    });

    await waitFor(() => {
      expect(result1.current.status).toBe('ACCEPTED');
      expect(result2.current.status).toBe('PENDING');
    });

    act(() => {
      window.dispatchEvent(new CustomEvent('verdict-update', {
        detail: { submissionId: 'sub-2', status: 'WRONG_ANSWER' },
      }));
    });

    await waitFor(() => {
      expect(result1.current.status).toBe('ACCEPTED');
      expect(result2.current.status).toBe('WRONG_ANSWER');
    });
  });

  it('should track polling attempts when polling enabled', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useVerdictSync(mockSubmissionId, { wsTimeout: 100, pollInterval: 500 }),
    );

    // Initially should not be polling
    expect(result.current.isPolling).toBe(false);
    expect(result.current.pollAttempts).toBe(0);

    // After WebSocket timeout, should start polling
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should be polling now
    expect(result.current.isPolling).toBe(true);

    jest.useRealTimers();
  });
});
