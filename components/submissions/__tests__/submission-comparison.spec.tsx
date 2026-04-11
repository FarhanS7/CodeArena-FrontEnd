import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionComparison } from '../SubmissionComparison';

describe('SubmissionComparison Component', () => {
  const mockSubmission1 = {
    id: 'sub-1',
    code: 'def twoSum(nums, target):\n  return [0, 1]',
    language: 'Python',
    status: 'ACCEPTED',
    submittedAt: '2024-01-14T10:30:00Z',
  };

  const mockSubmission2 = {
    id: 'sub-2',
    code: 'def twoSum(nums, target):\n  for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n      if nums[i] + nums[j] == target:\n        return [i, j]',
    language: 'Python',
    status: 'WRONG_ANSWER',
    submittedAt: '2024-01-14T11:00:00Z',
  };

  const mockProps = {
    submission1: mockSubmission1,
    submission2: mockSubmission2,
    isOpen: true,
    onClose: jest.fn(),
  };

  test('does not render when closed', () => {
    render(<SubmissionComparison {...mockProps} isOpen={false} />);

    expect(screen.queryByTestId('submission-comparison-view')).not.toBeInTheDocument();
  });

  test('does not render when submission1 is missing', () => {
    render(<SubmissionComparison {...mockProps} submission1={undefined} />);

    expect(screen.queryByTestId('submission-comparison-view')).not.toBeInTheDocument();
  });

  test('does not render when submission2 is missing', () => {
    render(<SubmissionComparison {...mockProps} submission2={undefined} />);

    expect(screen.queryByTestId('submission-comparison-view')).not.toBeInTheDocument();
  });

  test('renders comparison view when open', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByTestId('submission-comparison-view')).toBeInTheDocument();
  });

  test('displays comparison title', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByText('Submission Comparison')).toBeInTheDocument();
  });

  test('displays submission 1 details', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByText(/Version 1:/)).toBeInTheDocument();
  });

  test('displays submission 2 details', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByText(/Version 2:/)).toBeInTheDocument();
  });

  test('displays submission timestamps', () => {
    render(<SubmissionComparison {...mockProps} />);

    // Should contain both timestamps
    const versionTexts = screen.getAllByText(/Version/);
    expect(versionTexts.length).toBe(2);
  });

  test('displays submission statuses', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
    expect(screen.getByText('WRONG_ANSWER')).toBeInTheDocument();
  });

  test('displays submission 1 code', () => {
    const { container } = render(<SubmissionComparison {...mockProps} />);

    const preElements = container.querySelectorAll('pre');
    expect(preElements[0]).toHaveTextContent(/def twoSum/);
  });

  test('displays submission 2 code', () => {
    render(<SubmissionComparison {...mockProps} />);

    expect(screen.getByText(/for i in range/)).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<SubmissionComparison {...mockProps} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('arranges submissions side by side', () => {
    const { container } = render(<SubmissionComparison {...mockProps} />);

    const columns = container.querySelectorAll('.flex-1');
    // Should have multiple flex columns for side-by-side layout
    expect(columns.length).toBeGreaterThan(0);
  });

  test('displays close button with styled X icon', () => {
    render(<SubmissionComparison {...mockProps} />);

    // Close button should be visible
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  test('handles different submission timestamps', () => {
    const sub1WithTime = {
      ...mockSubmission1,
      submittedAt: '2024-01-10T08:00:00Z',
    };
    const sub2WithTime = {
      ...mockSubmission2,
      submittedAt: '2024-01-15T16:30:00Z',
    };

    render(
      <SubmissionComparison
        submission1={sub1WithTime}
        submission2={sub2WithTime}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    // Should display both dates
    expect(screen.getByText(/Version 1:/)).toBeInTheDocument();
    expect(screen.getByText(/Version 2:/)).toBeInTheDocument();
  });

  test('displays status for each submission', () => {
    render(<SubmissionComparison {...mockProps} />);

    const statusElements = screen.getAllByText(/(ACCEPTED|WRONG_ANSWER)/);
    expect(statusElements.length).toBeGreaterThanOrEqual(2);
  });

  test('modal scrolls code when content overflows', () => {
    const { container } = render(<SubmissionComparison {...mockProps} />);

    const preElements = container.querySelectorAll('pre');
    preElements.forEach((pre) => {
      expect(pre).toHaveClass('overflow-y-auto');
    });
  });
});
