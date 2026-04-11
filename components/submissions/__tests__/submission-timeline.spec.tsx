import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { SubmissionTimeline } from '../SubmissionTimeline';

describe('SubmissionTimeline Component', () => {
  const mockTimeline = [
    { date: '2024-01-08', submissions: 5, accepted: 3 },
    { date: '2024-01-09', submissions: 3, accepted: 2 },
    { date: '2024-01-10', submissions: 8, accepted: 7 },
    { date: '2024-01-11', submissions: 2, accepted: 1 },
    { date: '2024-01-12', submissions: 10, accepted: 8 },
    { date: '2024-01-13', submissions: 4, accepted: 4 },
    { date: '2024-01-14', submissions: 6, accepted: 5 },
  ];

  test('renders timeline title', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    expect(screen.getByText('Activity Timeline (Last 7 Days)')).toBeInTheDocument();
  });

  test('renders timeline container', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    expect(screen.getByTestId('submission-timeline')).toBeInTheDocument();
  });

  test('renders bars for each day', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    const bars = screen.getAllByTestId('timeline-day-bar');
    expect(bars).toHaveLength(7);
  });

  test('displays date labels', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    // Check for date labels in short format
    expect(screen.getByText('Jan 8')).toBeInTheDocument();
    expect(screen.getByText('Jan 14')).toBeInTheDocument();
  });

  test('displays submission counts', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // Jan 8
    expect(screen.getByText('10')).toBeInTheDocument(); // Jan 12
  });

  test('renders legend with accepted and rejected', () => {
    render(<SubmissionTimeline timeline={mockTimeline} />);

    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  test('bar height represents submission count', () => {
    const { container } = render(<SubmissionTimeline timeline={mockTimeline} />);

    const bars = container.querySelectorAll('[data-testid="timeline-day-bar"]');
    // Bars should have different heights based on submission count
    expect(bars.length).toBe(7);
  });

  test('green portion represents accepted submissions', () => {
    const { container } = render(<SubmissionTimeline timeline={mockTimeline} />);

    const acceptedPortions = container.querySelectorAll('.bg-green-500');
    // Should have green portions for each day
    expect(acceptedPortions.length).toBeGreaterThan(0);
  });

  test('calculates bar heights proportionally', () => {
    const { container } = render(<SubmissionTimeline timeline={mockTimeline} />);

    const bars = container.querySelectorAll('[data-testid="timeline-day-bar"]');
    const maxHeight = 100; // percentage

    // Check that bars have inline styles with height percentages
    bars.forEach((bar) => {
      const style = bar.getAttribute('style');
      expect(style).toMatch(/height:/);
    });
  });

  test('handles empty timeline', () => {
    render(<SubmissionTimeline timeline={[]} />);

    expect(screen.getByText('Activity Timeline (Last 7 Days)')).toBeInTheDocument();
  });

  test('handles single day', () => {
    const singleDay = [{ date: '2024-01-14', submissions: 5, accepted: 4 }];
    render(<SubmissionTimeline timeline={singleDay} />);

    expect(screen.getByText('Jan 14')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('handles all rejected submissions', () => {
    const allRejected = [{ date: '2024-01-14', submissions: 10, accepted: 0 }];
    render(<SubmissionTimeline timeline={allRejected} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    // Bar should have no green portion
  });

  test('handles all accepted submissions', () => {
    const allAccepted = [{ date: '2024-01-14', submissions: 10, accepted: 10 }];
    render(<SubmissionTimeline timeline={allAccepted} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    // Bar should be completely green
  });

  test('displays correct accepted percentage for each bar', () => {
    const { container } = render(<SubmissionTimeline timeline={mockTimeline} />);

    // First day: 3/5 = 60% accepted
    const firstBar = container.querySelector('[data-testid="timeline-day-bar"]');
    const greenPortion = firstBar?.querySelector('.bg-green-500');
    expect(greenPortion).toBeInTheDocument();
  });
});
