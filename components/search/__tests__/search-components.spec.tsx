import { render, screen, fireEvent } from '@testing-library/react';
import { SavedProblems, SearchHistory, Autocomplete, SavedPresets } from '@/components/search';

describe('SavedProblems Component', () => {
  const mockProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'EASY' as const,
      tags: ['Array'],
      acceptanceRate: 85,
      collection: 'Array',
    },
  ];

  it('renders saved problems list', () => {
    render(
      <SavedProblems
        problems={mockProblems}
        onUnsave={() => {}}
        onExport={() => {}}
        onProblemClick={() => {}}
      />,
    );
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
  });

  it('calls onUnsave when unsave button clicked', () => {
    const onUnsave = jest.fn();
    render(
      <SavedProblems
        problems={mockProblems}
        onUnsave={onUnsave}
        onExport={() => {}}
        onProblemClick={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('remove-saved-btn'));
    expect(onUnsave).toHaveBeenCalledWith(1);
  });

  it('displays difficulty badge', () => {
    render(
      <SavedProblems
        problems={mockProblems}
        onUnsave={() => {}}
        onExport={() => {}}
        onProblemClick={() => {}}
      />,
    );
    expect(screen.getByText('EASY')).toBeInTheDocument();
  });
});

describe('SearchHistory Component', () => {
  const mockHistory = [
    { id: 1, query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z', count: 5 },
    { id: 2, query: 'Array', timestamp: '2024-01-14T15:30:00Z', count: 3 },
  ];

  it('renders search history when open', () => {
    render(
      <SearchHistory
        history={mockHistory}
        isOpen={true}
        onSelectHistory={() => {}}
        onDeleteHistory={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
  });

  it('calls onSelectHistory when history item clicked', () => {
    const onSelect = jest.fn();
    render(
      <SearchHistory
        history={mockHistory}
        isOpen={true}
        onSelectHistory={onSelect}
        onDeleteHistory={() => {}}
        onClearAll={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('history-item-Two Sum'));
    expect(onSelect).toHaveBeenCalledWith('Two Sum');
  });
});

describe('Autocomplete Component', () => {
  const mockSuggestions = [
    { id: 1, title: 'Two Sum' },
    { id: 2, title: 'Two Sum II' },
  ];

  it('renders suggestions when open', () => {
    render(
      <Autocomplete
        suggestions={mockSuggestions}
        isOpen={true}
        onSelectSuggestion={() => {}}
      />,
    );
    expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
  });

  it('calls onSelectSuggestion when item clicked', () => {
    const onSelect = jest.fn();
    render(
      <Autocomplete
        suggestions={mockSuggestions}
        isOpen={true}
        onSelectSuggestion={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Two Sum'));
    expect(onSelect).toHaveBeenCalled();
  });
});
