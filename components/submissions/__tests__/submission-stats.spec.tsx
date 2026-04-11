import React from 'react';
import { render, screen } from '@testing-library/react';
import { SubmissionStatsDisplay } from '../SubmissionStatsDisplay';

describe('SubmissionStatsDisplay Component', () => {
  const mockStats = {
    totalSubmissions: 150,
    acceptedSubmissions: 120,
    rejectedSubmissions: 30,
    acceptanceRate: 0.8,
    averageScore: 85.5,
    languageBreakdown: {
      python: 45,
      java: 35,
      cpp: 40,
      javascript: 30,
    },
    successRatio: 0.8,
    totalTime: 5000,
    averageTimePerProblem: 33.3,
  };

  test('renders all stat cards', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Acceptance Rate')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
  });

  test('displays correct total submissions', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    expect(screen.getByTestId('stat-total-submissions')).toHaveTextContent('150');
  });

  test('displays correct accepted submissions', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    expect(screen.getByTestId('stat-accepted')).toHaveTextContent('120');
  });

  test('displays correct acceptance rate', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    expect(screen.getByTestId('stat-acceptance-rate')).toHaveTextContent('80.0%');
  });

  test('displays correct average score', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    const avgScore = screen.getByTestId('stat-avg-score');
    // 85.5 rounds to 86
    expect(avgScore).toHaveTextContent('86');
  });

  test('renders with green color for accepted stat', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    const acceptedStat = screen.getByTestId('stat-accepted');
    expect(acceptedStat).toHaveClass('text-green-600');
  });

  test('renders with blue color for acceptance rate', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    const acceptanceRate = screen.getByTestId('stat-acceptance-rate');
    expect(acceptanceRate).toHaveClass('text-blue-600');
  });

  test('renders with purple color for average score', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    const avgScore = screen.getByTestId('stat-avg-score');
    expect(avgScore).toHaveClass('text-purple-600');
  });

  test('displays descriptive text for each stat', () => {
    render(<SubmissionStatsDisplay stats={mockStats} />);

    expect(screen.getByText('All time submissions')).toBeInTheDocument();
    expect(screen.getByText('Successful solutions')).toBeInTheDocument();
    expect(screen.getByText('Success percentage')).toBeInTheDocument();
    expect(screen.getByText('Out of 100')).toBeInTheDocument();
  });

  test('formats acceptance rate as percentage', () => {
    const statsWithLowRate = { ...mockStats, acceptanceRate: 0.456 };
    render(<SubmissionStatsDisplay stats={statsWithLowRate} />);

    expect(screen.getByTestId('stat-acceptance-rate')).toHaveTextContent('45.6%');
  });

  test('handles zero submissions', () => {
    const statsWithZero = {
      ...mockStats,
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      acceptanceRate: 0,
      averageScore: 0,
    };
    render(<SubmissionStatsDisplay stats={statsWithZero} />);

    expect(screen.getByTestId('stat-total-submissions')).toHaveTextContent('0');
    expect(screen.getByTestId('stat-accepted')).toHaveTextContent('0');
  });
});
