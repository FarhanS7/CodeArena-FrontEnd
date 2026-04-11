import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage, Pagination } from '../SearchUtils';

describe('ErrorMessage Component', () => {
  test('displays error message', () => {
    render(<ErrorMessage message="Search failed. Please try again." />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Search Error')).toBeInTheDocument();
    expect(screen.getByText('Search failed. Please try again.')).toBeInTheDocument();
  });

  test('renders with alert icon', () => {
    const { container } = render(<ErrorMessage message="Test error" />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    pageSize: 10,
    onPageChange: mockOnPageChange,
  };

  test('displays pagination info', () => {
    render(<Pagination {...defaultProps} />);

    const info = screen.getByTestId('pagination-info');
    expect(info).toHaveTextContent('Showing');
    expect(info).toHaveTextContent('1');
    expect(info).toHaveTextContent('10');
    expect(info).toHaveTextContent('50');
  });

  test('displays page numbers', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevBtn = screen.getByTestId('prev-page-btn');
    expect(prevBtn).toBeDisabled();
  });

  test('enables previous button when not on first page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    const prevBtn = screen.getByTestId('prev-page-btn');
    expect(prevBtn).not.toBeDisabled();
  });

  test('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);

    const nextBtn = screen.getByTestId('next-page-btn');
    expect(nextBtn).toBeDisabled();
  });

  test('enables next button when not on last page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const nextBtn = screen.getByTestId('next-page-btn');
    expect(nextBtn).not.toBeDisabled();
  });

  test('calls onPageChange with prev page when previous button clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={2} />);

    const prevBtn = screen.getByTestId('prev-page-btn');
    await user.click(prevBtn);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange with next page when next button clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={1} />);

    const nextBtn = screen.getByTestId('next-page-btn');
    await user.click(nextBtn);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange when page number clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={1} />);

    const pageBtn = screen.getByText('3');
    await user.click(pageBtn);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('updates page range info on different pages', () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={2} />);

    let info = screen.getByTestId('pagination-info');
    expect(info).toHaveTextContent('Showing');
    expect(info).toHaveTextContent('11');
    expect(info).toHaveTextContent('20');

    rerender(<Pagination {...defaultProps} currentPage={3} />);

    info = screen.getByTestId('pagination-info');
    expect(info).toHaveTextContent('21');
    expect(info).toHaveTextContent('30');
  });

  test('handles edge case of last page with fewer items', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalItems={46}
        pageSize={10}
        onPageChange={mockOnPageChange}
      />,
    );

    const info = screen.getByTestId('pagination-info');
    expect(info).toHaveTextContent('41');
    expect(info).toHaveTextContent('46');
  });
});
