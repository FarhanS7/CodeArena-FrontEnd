import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProblemCard, ProblemGrid, TrendingProblems, RecommendedProblems } from '../ProblemComponents';

const mockProblem = {
  id: 1,
  title: 'Two Sum',
  difficulty: 'EASY' as const,
  acceptanceRate: 85,
  submissions: 1200,
  tags: ['Array', 'Hash Table'],
  rating: 4.5,
  isSaved: false,
};

describe('ProblemCard Component', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnSave = jest.fn();

  test('displays problem information', () => {
    render(
      <ProblemCard
        problem={mockProblem}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('EASY')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  test('displays problem tags', () => {
    render(
      <ProblemCard
        problem={mockProblem}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('Array')).toBeInTheDocument();
    expect(screen.getByText('Hash Table')).toBeInTheDocument();
  });

  test('displays rating if available', () => {
    render(
      <ProblemCard
        problem={mockProblem}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('calls onViewDetails when card is clicked', () => {
    render(
      <ProblemCard
        problem={mockProblem}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByTestId('problem-card'));
    expect(mockOnViewDetails).toHaveBeenCalledWith(1);
  });

  test('save button shows bookmark icon when saved', () => {
    render(
      <ProblemCard
        problem={{ ...mockProblem, isSaved: true }}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    const saveBtn = screen.getByTestId('save-problem-btn');
    expect(saveBtn.querySelector('svg')).toBeInTheDocument();
  });

  test('calls onSave when save button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProblemCard
        problem={mockProblem}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    await user.click(screen.getByTestId('save-problem-btn'));
    expect(mockOnSave).toHaveBeenCalledWith(1);
  });
});

describe('ProblemGrid Component', () => {
  const mockProblems = [mockProblem, { ...mockProblem, id: 2, title: 'Three Sum' }];
  const mockOnViewDetails = jest.fn();
  const mockOnSave = jest.fn();

  test('displays multiple problem cards', () => {
    render(
      <ProblemGrid
        problems={mockProblems}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Three Sum')).toBeInTheDocument();
  });

  test('displays loading spinner when loading', () => {
    render(
      <ProblemGrid
        problems={[]}
        isLoading={true}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('displays no results message when empty', () => {
    render(
      <ProblemGrid
        problems={[]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    expect(screen.getByText('No problems found')).toBeInTheDocument();
  });
});

describe('TrendingProblems Component', () => {
  const trendingProblems = [
    {
      ...mockProblem,
      id: 100,
      title: 'Trending Problem 1',
    },
    {
      ...mockProblem,
      id: 101,
      title: 'Trending Problem 2',
    },
  ];

  test('displays trending section with problems', () => {
    render(<TrendingProblems problems={trendingProblems} onViewDetails={jest.fn()} />);

    expect(screen.getByTestId('trending-section')).toBeInTheDocument();
    expect(screen.getByText('Trending This Week')).toBeInTheDocument();
    expect(screen.getByText('Trending Problem 1')).toBeInTheDocument();
    expect(screen.getByText('Trending Problem 2')).toBeInTheDocument();
  });

  test('does not render when no trending problems', () => {
    render(<TrendingProblems problems={[]} onViewDetails={jest.fn()} />);

    expect(screen.queryByTestId('trending-section')).not.toBeInTheDocument();
  });

  test('navigates to problem when trending card is clicked', () => {
    const mockViewDetails = jest.fn();
    render(<TrendingProblems problems={trendingProblems} onViewDetails={mockViewDetails} />);

    fireEvent.click(screen.getByTestId('trending-problem-card'));
    expect(mockViewDetails).toHaveBeenCalledWith(100);
  });
});

describe('RecommendedProblems Component', () => {
  const recommendedProblems = [
    {
      ...mockProblem,
      id: 200,
      title: 'Recommended 1',
      reason: 'Similar to problems you solved',
    },
    {
      ...mockProblem,
      id: 201,
      title: 'Recommended 2',
      reason: 'Based on your skill level',
    },
  ];

  test('displays recommendations section with problems', () => {
    render(
      <RecommendedProblems problems={recommendedProblems} onViewDetails={jest.fn()} />,
    );

    expect(screen.getByTestId('recommendations-section')).toBeInTheDocument();
    expect(screen.getByText('Recommended For You')).toBeInTheDocument();
    expect(screen.getByText('Recommended 1')).toBeInTheDocument();
    expect(screen.getByText('Similar to problems you solved')).toBeInTheDocument();
  });

  test('displays recommendation reasons', () => {
    render(
      <RecommendedProblems problems={recommendedProblems} onViewDetails={jest.fn()} />,
    );

    expect(screen.getByText('Similar to problems you solved')).toBeInTheDocument();
    expect(screen.getByText('Based on your skill level')).toBeInTheDocument();
  });

  test('does not render when no recommendations', () => {
    render(<RecommendedProblems problems={[]} onViewDetails={jest.fn()} />);

    expect(screen.queryByTestId('recommendations-section')).not.toBeInTheDocument();
  });
});
