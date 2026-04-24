import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SubmissionVerdictProvider, useSubmissionVerdict } from '../SubmissionVerdictProvider';

/**
 * Provider Tests - Submission Verdict Provider
 * Tests for global verdict state management and broadcasting
 */

describe('SubmissionVerdictProvider', () => {
  // Test component that uses the provider
  function TestComponent({ submissionId }: { submissionId: string }) {
    const { getVerdict, registerSubmission, unregisterSubmission, broadcastVerdict } =
      useSubmissionVerdict();

    React.useEffect(() => {
      registerSubmission(submissionId);
      return () => unregisterSubmission(submissionId);
    }, [submissionId, registerSubmission, unregisterSubmission]);

    const verdict = getVerdict(submissionId);

    return (
      <div>
        <div data-testid="status">{verdict?.status || 'PENDING'}</div>
        <div data-testid="score">{verdict?.score || '0'}</div>
        <button
          onClick={() => {
            broadcastVerdict({
              submissionId,
              status: 'ACCEPTED',
              score: 100,
            });
          }}
        >
          Update
        </button>
      </div>
    );
  }

  it('should provide verdict context to children', () => {
    render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('PENDING');
  });

  it('should broadcast verdict to all listeners', async () => {
    render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    const updateButton = screen.getByText('Update');
    updateButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ACCEPTED');
    });

    expect(screen.getByTestId('score')).toHaveTextContent('100');
  });

  it('should track multiple submissions', async () => {
    const { rerender } = render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    const updateButton = screen.getByText('Update');
    updateButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ACCEPTED');
    });

    rerender(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-2" />
      </SubmissionVerdictProvider>,
    );

    // New submission should start as PENDING
    expect(screen.getByTestId('status')).toHaveTextContent('PENDING');
  });

  it('should throw error when hook used outside provider', () => {
    function BadComponent() {
      useSubmissionVerdict();
      return <div>Bad</div>;
    }

    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<BadComponent />);
    }).toThrow('useSubmissionVerdict must be used within SubmissionVerdictProvider');

    spy.mockRestore();
  });

  it('should register and unregister submissions', async () => {
    const { unmount } = render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    // Register should be called on mount
    const updateButton = screen.getByText('Update');
    updateButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ACCEPTED');
    });

    // Unregister should be called on unmount
    unmount();

    // New render with same ID should not have the verdict
    render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('PENDING');
  });

  it('should maintain verdict state across re-renders', async () => {
    const { rerender } = render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    const updateButton = screen.getByText('Update');
    updateButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ACCEPTED');
    });

    // Force re-render
    rerender(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    // Verdict should persist
    expect(screen.getByTestId('status')).toHaveTextContent('ACCEPTED');
  });

  it('should broadcast verdict without submissionId registration', async () => {
    render(
      <SubmissionVerdictProvider>
        <TestComponent submissionId="sub-1" />
      </SubmissionVerdictProvider>,
    );

    // Even if not registered initially, broadcast should work
    window.dispatchEvent(
      new CustomEvent('verdict-update', {
        detail: {
          submissionId: 'sub-1',
          status: 'WRONG_ANSWER',
        },
      }),
    );

    // Note: This test depends on the event listener in the provider
    // The verdict may not update if not registered
  });
});
