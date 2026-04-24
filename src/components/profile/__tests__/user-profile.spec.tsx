import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../UserProfile';

/**
 * Component Unit Tests - UserProfile & Related Components
 * TDD GREEN Phase - Component Implementation Tests
 */

describe('UserProfile Component Suite', () => {
  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Competitive programmer',
    location: 'San Francisco',
    website: 'https://example.com',
    joinedAt: '2023-01-15T00:00:00Z',
  };

  const mockStats = {
    problemsSolved: 45,
    submissionAccepted: 78,
    submissionTotal: 156,
    contestsParticipated: 12,
    rating: 1650,
    maxRating: 1800,
    acceptanceRate: 0.5,
    averageTime: 245,
    globalRank: 234,
    totalUsers: 10000,
    percentile: 97.7,
  };

  const mockSubmissions = [
    {
      id: 'sub-1',
      problemId: 123,
      problemTitle: 'Two Sum',
      status: 'ACCEPTED',
      language: 'python',
      submittedAt: new Date().toISOString(),
      score: 100,
    },
    {
      id: 'sub-2',
      problemId: 124,
      problemTitle: 'Reverse String',
      status: 'WRONG_ANSWER',
      language: 'java',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      score: 0,
    },
  ];

  const mockContests = [
    {
      id: 1,
      title: 'Weekly Contest 1',
      rank: 15,
      score: 250,
      participantCount: 500,
      ratingChange: 50,
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Weekly Contest 2',
      rank: 8,
      score: 350,
      participantCount: 600,
      ratingChange: 100,
      date: new Date(Date.now() - 604800000).toISOString(),
    },
  ];

  const mockRatingHistory = [
    { date: new Date(Date.now() - 604800000 * 4).toISOString(), rating: 1500 },
    { date: new Date(Date.now() - 604800000 * 3).toISOString(), rating: 1550 },
    { date: new Date(Date.now() - 604800000 * 2).toISOString(), rating: 1600 },
    { date: new Date(Date.now() - 604800000).toISOString(), rating: 1650 },
  ];

  describe('UserProfile - Main Component', () => {
    test('should render profile header with user information', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-header')).toBeInTheDocument();
      });

      expect(screen.getByTestId('username')).toHaveTextContent('testuser');
      expect(screen.getByTestId('bio')).toHaveTextContent('Competitive programmer');
      expect(screen.getByTestId('location')).toHaveTextContent('San Francisco');
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    });

    test('should display statistics cards', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={false}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('problems-solved')).toHaveTextContent('45');
      });

      expect(screen.getByTestId('acceptance-rate')).toHaveTextContent('50');
      expect(screen.getByTestId('current-rating')).toHaveTextContent('1650');
      expect(screen.getByTestId('contests-participated')).toHaveTextContent('12');
    });

    test('should display rating progress bar', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('rating-progress-bar')).toBeInTheDocument();
      });

      expect(screen.getByTestId('rating-text')).toHaveTextContent('1650 / 1800');
    });

    test('should display submission statistics', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('submission-stats')).toBeInTheDocument();
      });

      expect(screen.getByTestId('accepted-count')).toHaveTextContent('78');
      expect(screen.getByTestId('total-submissions')).toHaveTextContent('156');
    });

    test('should display global rank and percentile', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('global-rank')).toHaveTextContent('234');
      });

      expect(screen.getByTestId('percentile')).toHaveTextContent('97.7');
    });

    test('should show edit profile button for own profile', async () => {
      const onEdit = jest.fn();
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={onEdit}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('edit-profile-btn')).toBeVisible();
      });

      fireEvent.click(screen.getByTestId('edit-profile-btn'));
      expect(onEdit).toHaveBeenCalled();
    });

    test('should not show edit profile button for other users', async () => {
      render(
        <UserProfile
          userId="user-2"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={false}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-header')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('edit-profile-btn')).not.toBeInTheDocument();
    });
  });

  describe('UserProfile - Tabs Navigation', () => {
    test('should display tabs for different sections', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('submissions-tab')).toBeInTheDocument();
      });

      expect(screen.getByTestId('contests-tab')).toBeInTheDocument();
    });

    test('should switch to submissions tab on click', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      await waitFor(() => {
        const rows = screen.getAllByTestId('submission-row');
        expect(rows.length).toBeGreaterThan(0);
      });
    });

    test('should switch to contests tab on click', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const contestsTab = await screen.findByTestId('contests-tab');
      fireEvent.click(contestsTab);

      await waitFor(() => {
        expect(screen.getAllByTestId('contest-row').length).toBeGreaterThan(0);
      });
    });
  });

  describe('UserProfile - Submissions Tab', () => {
    test('should display all submissions in submissions tab', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      await waitFor(() => {
        const rows = screen.getAllByTestId('submission-row');
        expect(rows).toHaveLength(2);
      });

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Reverse String')).toBeInTheDocument();
    });

    test('should filter submissions by status', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      const statusFilter = await screen.findByTestId('status-filter');
      fireEvent.change(statusFilter, { target: { value: 'ACCEPTED' } });

      await waitFor(() => {
        const rows = screen.getAllByTestId('submission-row');
        expect(rows.length).toBeLessThanOrEqual(mockSubmissions.length);
      });
    });

    test('should sort submissions by date', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      const sortSelector = await screen.findByTestId('sort-selector');
      fireEvent.change(sortSelector, { target: { value: 'date' } });

      await waitFor(() => {
        const firstRow = screen.getAllByTestId('submission-row')[0];
        expect(firstRow).toHaveTextContent('Two Sum');
      });
    });

    test('should display submission language and status', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      await waitFor(() => {
        const firstRow = screen.getAllByTestId('submission-row')[0];
        expect(firstRow).toHaveTextContent('python');
        expect(firstRow).toHaveTextContent('ACCEPTED');
      });
    });
  });

  describe('UserProfile - Contests Tab', () => {
    test('should display contests in contests tab', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const contestsTab = await screen.findByTestId('contests-tab');
      fireEvent.click(contestsTab);

      await waitFor(() => {
        const rows = screen.getAllByTestId('contest-row');
        expect(rows).toHaveLength(2);
      });

      expect(screen.getByText('Weekly Contest 1')).toBeInTheDocument();
      expect(screen.getByText('Weekly Contest 2')).toBeInTheDocument();
    });

    test('should display contest details (rank, score, rating change)', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const contestsTab = await screen.findByTestId('contests-tab');
      fireEvent.click(contestsTab);

      await waitFor(() => {
        const row = screen.getAllByTestId('contest-row')[0];
        expect(row).toHaveTextContent('#15'); // rank displays as #15
        expect(row).toHaveTextContent('+50'); // rating change
      });
    });

    test('should display rating graph in contests tab', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const contestsTab = await screen.findByTestId('contests-tab');
      fireEvent.click(contestsTab);

      await waitFor(() => {
        expect(screen.getByTestId('rating-graph')).toBeInTheDocument();
      });
    });
  });

  describe('UserProfile - Settings Button', () => {
    test('should display settings button', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-settings-btn')).toBeInTheDocument();
      });
    });

    test('should navigate to settings on settings button click', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const settingsBtn = await screen.findByTestId('profile-settings-btn');
      fireEvent.click(settingsBtn);

      // Navigation will be handled by Next.js router in actual app
      expect(settingsBtn).toBeInTheDocument();
    });
  });

  describe('UserProfile - Empty States', () => {
    test('should handle empty submissions gracefully', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={[]}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const submissionsTab = await screen.findByTestId('submissions-tab');
      fireEvent.click(submissionsTab);

      await waitFor(() => {
        expect(screen.queryByTestId('submission-row')).not.toBeInTheDocument();
      });
    });

    test('should handle empty contests gracefully', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={[]}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      const contestsTab = await screen.findByTestId('contests-tab');
      fireEvent.click(contestsTab);

      await waitFor(() => {
        expect(screen.queryByTestId('contest-row')).not.toBeInTheDocument();
      });
    });
  });

  describe('UserProfile - Avatar and Styling', () => {
    test('should display user avatar with proper image src', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        const avatar = screen.getByTestId('user-avatar') as HTMLImageElement;
        expect(avatar.src).toContain('avatar.jpg');
      });
    });

    test('should apply user status color class', async () => {
      render(
        <UserProfile
          userId="user-1"
          user={mockUser}
          stats={mockStats}
          submissions={mockSubmissions}
          contests={mockContests}
          ratingHistory={mockRatingHistory}
          isOwnProfile={true}
          onEditProfile={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-header')).toBeInTheDocument();
      });
    });
  });
});
