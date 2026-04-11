import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionDetailsModal } from '../SubmissionDetailsModal';

describe('SubmissionDetailsModal Component', () => {
  const mockTestResults = [
    {
      testCase: 1,
      expected: '[1, 2]',
      actual: '[1, 2]',
      status: 'PASS' as const,
      stderr: '',
    },
    {
      testCase: 2,
      expected: '[2, 7]',
      actual: '[2, 3]',
      status: 'FAIL' as const,
      stderr: 'Wrong answer',
    },
  ];

  const mockProps = {
    submissionId: 'sub-123',
    code: 'def twoSum(nums, target):\n  return [0, 1]',
    language: 'Python',
    status: 'WRONG_ANSWER',
    testResults: mockTestResults,
    isOpen: true,
    onClose: jest.fn(),
    onRetry: jest.fn(),
  };

  test('does not render when closed', () => {
    render(<SubmissionDetailsModal {...mockProps} isOpen={false} />);

    expect(screen.queryByTestId('submission-details-modal')).not.toBeInTheDocument();
  });

  test('renders modal when open', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByTestId('submission-details-modal')).toBeInTheDocument();
  });

  test('displays modal title', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText('Submission Details')).toBeInTheDocument();
  });

  test('displays submission ID', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText('sub-123')).toBeInTheDocument();
  });

  test('displays programming language', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  test('displays submission status', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText('WRONG_ANSWER')).toBeInTheDocument();
  });

  test('displays code in code block', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText(/def twoSum/)).toBeInTheDocument();
  });

  test('displays test results', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Test Case 1')).toBeInTheDocument();
    expect(screen.getByText('Test Case 2')).toBeInTheDocument();
  });

  test('displays passed test result', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByTestId('test-result-1')).toBeInTheDocument();
    const passResult = screen.getByTestId('test-result-1');
    expect(within(passResult).getByText('PASS')).toBeInTheDocument();
  });

  test('displays failed test result with expected and actual', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    const failResult = screen.getByTestId('test-result-2');
    expect(within(failResult).getByText(/Expected:/)).toBeInTheDocument();
    expect(within(failResult).getByText(/\[2, 7\]/)).toBeInTheDocument();
    expect(within(failResult).getByText(/Actual:/)).toBeInTheDocument();
    expect(within(failResult).getByText(/\[2, 3\]/)).toBeInTheDocument();
  });

  test('displays error message for failed tests', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    const failResult = screen.getByTestId('test-result-2');
    expect(within(failResult).getByText(/Error:/)).toBeInTheDocument();
    expect(within(failResult).getByText(/Wrong answer/)).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<SubmissionDetailsModal {...mockProps} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('calls onRetry when retry button clicked', async () => {
    const user = userEvent.setup();
    render(<SubmissionDetailsModal {...mockProps} />);

    const retryButton = screen.getByTestId('retry-submission-btn');
    await user.click(retryButton);

    expect(mockProps.onRetry).toHaveBeenCalled();
  });

  test('displays retry button with correct text', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    expect(screen.getByTestId('retry-submission-btn')).toHaveTextContent('Retry Submission');
  });

  test('applies correct styling to failed tests', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    const failResult = screen.getByTestId('test-result-2');
    expect(failResult).toHaveClass('border-red-200');
  });

  test('applies correct styling to passed tests', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    const passResult = screen.getByTestId('test-result-1');
    expect(passResult).toHaveClass('border-green-200');
  });

  test('hides expected/actual for passed tests', () => {
    render(<SubmissionDetailsModal {...mockProps} />);

    const passResult = screen.getByTestId('test-result-1');
    expect(within(passResult).queryByText(/Expected:/)).not.toBeInTheDocument();
  });

  test('handles empty test results array', () => {
    render(<SubmissionDetailsModal {...mockProps} testResults={[]} />);

    expect(screen.getByText('Test Results')).toBeInTheDocument();
  });
});
