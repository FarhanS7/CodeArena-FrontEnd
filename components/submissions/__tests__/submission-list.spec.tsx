import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmissionList } from '../SubmissionList';

describe('SubmissionList Component', () => {
  const mockSubmissions = [
    {
      id: '1',
      problemId: 1,
      problemTitle: 'Two Sum',
      status: 'ACCEPTED' as const,
      language: 'Python',
      submittedAt: '2024-01-15T10:30:00Z',
      score: 100,
      difficulty: 'EASY' as const,
      verdict: {
        runtime: 45,
        memory: 12.5,
        runtimePercent: 75,
        memoryPercent: 65,
      },
    },
    {
      id: '2',
      problemId: 2,
      problemTitle: 'Merge Sorted Arrays',
      status: 'WRONG_ANSWER' as const,
      language: 'Java',
      submittedAt: '2024-01-14T14:20:00Z',
      score: 30,
      difficulty: 'MEDIUM' as const,
      verdict: {
        runtime: 120,
        memory: 25.0,
        runtimePercent: 90,
        memoryPercent: 80,
      },
    },
  ];

  const mockProps = {
    submissions: mockSubmissions,
    total: 2,
    page: 1,
    pageSize: 10,
    isLoading: false,
    onPageChange: jest.fn(),
    onSubmissionClick: jest.fn(),
    onStatusFilterChange: jest.fn(),
    onSearchChange: jest.fn(),
    onSort: jest.fn(),
  };

  test('renders submission list with headers', () => {
    render(<SubmissionList {...mockProps} />);

    expect(screen.getByText('Date ↓')).toBeInTheDocument();
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Score ↓')).toBeInTheDocument();
  });

  test('renders submissions in table rows', () => {
    render(<SubmissionList {...mockProps} />);

    const rows = screen.getAllByTestId('submission-row');
    expect(rows).toHaveLength(2);
  });

  test('displays submission status badges with correct colors', () => {
    render(<SubmissionList {...mockProps} />);

    const badges = screen.getAllByTestId('submission-status-badge');
    expect(badges[0]).toHaveTextContent('ACCEPTED');
    expect(badges[1]).toHaveTextContent('WRONG ANSWER');
  });

  test('displays submission difficulty badges', () => {
    render(<SubmissionList {...mockProps} />);

    expect(screen.getByTestId('difficulty-badge-EASY')).toHaveTextContent('EASY');
    expect(screen.getByTestId('difficulty-badge-MEDIUM')).toHaveTextContent('MEDIUM');
  });

  test('displays runtime and memory metrics', () => {
    render(<SubmissionList {...mockProps} />);

    const runtimes = screen.getAllByTestId('runtime-ms');
    const memories = screen.getAllByTestId('memory-mb');

    expect(runtimes[0]).toHaveTextContent('45ms');
    expect(memories[0]).toHaveTextContent('12.5MB');
  });

  test('calls onSubmissionClick when row is clicked', () => {
    render(<SubmissionList {...mockProps} />);

    const rows = screen.getAllByTestId('submission-row');
    fireEvent.click(rows[0]);

    expect(mockProps.onSubmissionClick).toHaveBeenCalledWith(mockSubmissions[0]);
  });

  test('filters submissions by status', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const statusFilter = screen.getByTestId('status-filter');
    await user.selectOptions(statusFilter, 'ACCEPTED');

    expect(mockProps.onStatusFilterChange).toHaveBeenCalledWith('ACCEPTED');
  });

  test('searches submissions by title', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const searchInput = screen.getByTestId('submission-search');
    await user.type(searchInput, 'Two Sum');

    expect(mockProps.onSearchChange).toHaveBeenCalledWith('Two Sum');
  });

  test('sorts by date', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const dateHeader = screen.getByTestId('sort-by-date');
    await user.click(dateHeader);

    expect(mockProps.onSort).toHaveBeenCalledWith('date');
  });

  test('sorts by language', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const languageHeader = screen.getByTestId('sort-by-language');
    await user.click(languageHeader);

    expect(mockProps.onSort).toHaveBeenCalledWith('language');
  });

  test('sorts by score', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const scoreHeader = screen.getByTestId('sort-by-score');
    await user.click(scoreHeader);

    expect(mockProps.onSort).toHaveBeenCalledWith('score');
  });

  test('shows loading state', () => {
    render(<SubmissionList {...mockProps} isLoading={true} />);

    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });

  test('shows empty state when no submissions', () => {
    render(<SubmissionList {...mockProps} submissions={[]} />);

    expect(screen.getByText('No submissions found')).toBeInTheDocument();
  });

  test('paginates submissions correctly', () => {
    render(<SubmissionList {...mockProps} total={25} pageSize={10} />);

    expect(screen.getByTestId('pagination-info')).toHaveTextContent('Showing 1 - 10 of 25 submissions');
  });

  test('changes page on pagination button click', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} total={25} pageSize={10} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockProps.onPageChange).toHaveBeenCalledWith(2);
  });

  test('exports CSV', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const exportBtn = screen.getByTestId('export-csv-btn');
    await user.click(exportBtn);

    expect(exportBtn).toBeInTheDocument();
  });

  test('generates performance report', async () => {
    const user = userEvent.setup();
    render(<SubmissionList {...mockProps} />);

    const reportBtn = screen.getByTestId('generate-report-btn');
    await user.click(reportBtn);

    expect(reportBtn).toBeInTheDocument();
  });
});
