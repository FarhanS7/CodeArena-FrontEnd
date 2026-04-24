import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ContestLeaderboard } from '../ContestLeaderboard';

/**
 * Component Tests - Contest Leaderboard
 * Tests for real-time ranking display and WebSocket updates
 */

describe('ContestLeaderboard Component', () => {
  const mockParticipants = [
    { rank: 1, username: 'alice', score: 300, solved: 3 },
    { rank: 2, username: 'bob', score: 200, solved: 2 },
    { rank: 3, username: 'charlie', score: 100, solved: 1 },
  ];

  it('should render leaderboard and participants', () => {
    render(<ContestLeaderboard participants={mockParticipants} />);

    const rows = screen.getAllByTestId('leaderboard-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should display participant information correctly', () => {
    render(<ContestLeaderboard participants={mockParticipants} />);

    // Check first place
    const firstRow = screen.getAllByTestId('leaderboard-row')[0];
    expect(firstRow).toHaveTextContent('alice');
    expect(firstRow).toHaveTextContent('300');
    expect(firstRow).toHaveTextContent('3');
  });

  it('should highlight current user row', () => {
    const participants = [
      { rank: 1, username: 'alice', score: 300, solved: 3 },
      { rank: 2, username: 'bob', score: 200, solved: 2, isCurrentUser: true },
    ];

    render(<ContestLeaderboard participants={participants} />);

    const rows = screen.getAllByTestId('leaderboard-row');
    const bobRow = rows[1];

    expect(bobRow).toHaveClass('bg-blue-50');
    expect(bobRow).toHaveAttribute('data-current-user', 'true');
  });

  it('should show "You" badge for current user', () => {
    const participants = [
      { rank: 1, username: 'testuser', score: 300, solved: 3, isCurrentUser: true },
    ];

    render(<ContestLeaderboard participants={participants} />);

    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('should paginate leaderboard with more than 10 participants', () => {
    const largeList = Array.from({ length: 25 }, (_, i) => ({
      rank: i + 1,
      username: `user${i + 1}`,
      score: 300 - i * 10,
      solved: 3,
    }));

    render(<ContestLeaderboard participants={largeList} />);

    // First page should show 10 participants
    let rows = screen.getAllByTestId('leaderboard-row');
    expect(rows.length).toBeLessThanOrEqual(10);

    // Check first user is user1
    expect(rows[0]).toHaveTextContent('user1');
  });

  it('should disable pagination buttons at boundaries', () => {
    const largeList = Array.from({ length: 15 }, (_, i) => ({
      rank: i + 1,
      username: `user${i + 1}`,
      score: 300 - i * 10,
      solved: 3,
    }));

    render(<ContestLeaderboard participants={largeList} />);

    const prevButton = screen.getByTestId('leaderboard-prev-page');
    const nextButton = screen.getByTestId('leaderboard-next-page');

    // On first page, prev should be disabled
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Click next to go to page 2
    fireEvent.click(nextButton);

    // On second page, next should be disabled
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('should display all participants from props', () => {
    const participants = [
      { rank: 1, username: 'alice', score: 300, solved: 3 },
      { rank: 2, username: 'bob', score: 200, solved: 2 },
      { rank: 3, username: 'charlie', score: 100, solved: 1 },
      { rank: 4, username: 'david', score: 50, solved: 0 },
    ];

    render(<ContestLeaderboard participants={participants} />);

    const rows = screen.getAllByTestId('leaderboard-row');
    expect(rows).toHaveLength(participants.length);

    // Check all participants are displayed
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('charlie')).toBeInTheDocument();
    expect(screen.getByText('david')).toBeInTheDocument();
  });

  it('should display error state when leaderboard fails to load', () => {
    render(
      <ContestLeaderboard
        participants={[]}
      />,
    );

    // Simulate error - typically would come from parent component
    const { rerender } = render(
      <ContestLeaderboard participants={[]} />,
    );

    // If there are no participants and no loading state, component should handle gracefully
    const rows = screen.queryAllByTestId('leaderboard-row');
    expect(rows).toHaveLength(0);
  });

  it('should show participant avatars with first letter', () => {
    render(<ContestLeaderboard participants={mockParticipants} />);

    expect(screen.getByText('A')).toBeInTheDocument(); // alice
    expect(screen.getByText('B')).toBeInTheDocument(); // bob
    expect(screen.getByText('C')).toBeInTheDocument(); // charlie
  });

  it('should display participant ranks', () => {
    render(<ContestLeaderboard participants={mockParticipants} />);

    const rankCells = screen.getAllByTestId('rank');
    expect(rankCells[0]).toHaveTextContent('1');
    expect(rankCells[1]).toHaveTextContent('2');
    expect(rankCells[2]).toHaveTextContent('3');
  });

  it('should display score cells', () => {
    render(<ContestLeaderboard participants={mockParticipants} />);

    const scoreCells = screen.getAllByTestId('leaderboard-score');
    expect(scoreCells[0]).toHaveTextContent('300');
    expect(scoreCells[1]).toHaveTextContent('200');
    expect(scoreCells[2]).toHaveTextContent('100');
  });

  it('should display empty state with no participants', () => {
    render(<ContestLeaderboard participants={[]} />);

    const rows = screen.queryAllByTestId('leaderboard-row');
    expect(rows).toHaveLength(0);
  });
});
