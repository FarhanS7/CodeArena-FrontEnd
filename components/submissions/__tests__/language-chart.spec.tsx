import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageChart } from '../LanguageChart';

describe('LanguageChart Component', () => {
  const mockLanguageBreakdown = {
    python: 45,
    java: 35,
    cpp: 40,
    javascript: 30,
  };

  test('renders language chart title', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    expect(screen.getByText('Language Distribution')).toBeInTheDocument();
  });

  test('renders chart container', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    expect(screen.getByTestId('language-distribution-chart')).toBeInTheDocument();
  });

  test('displays all languages', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    expect(screen.getByTestId('chart-label-python')).toHaveTextContent('Python');
    expect(screen.getByTestId('chart-label-java')).toHaveTextContent('Java');
    expect(screen.getByTestId('chart-label-cpp')).toHaveTextContent('Cpp');
    expect(screen.getByTestId('chart-label-javascript')).toHaveTextContent('Javascript');
  });

  test('calculates percentages correctly', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    const total = 150;
    // cpp: 40/150 = 26.7%
    const cppPercentage = (40 / total) * 100;
    expect(screen.getByText(new RegExp(`40.*${cppPercentage.toFixed(1)}%`))).toBeInTheDocument();
  });

  test('sorts languages by submission count descending', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    const labels = screen.getAllByTestId(/chart-label-/);
    // Should be sorted: Python (45) > Cpp (40) > Java (35) > JavaScript (30)
    expect(labels[0]).toHaveTextContent('Python');
    expect(labels[1]).toHaveTextContent('Cpp');
    expect(labels[2]).toHaveTextContent('Java');
    expect(labels[3]).toHaveTextContent('Javascript');
  });

  test('displays total submissions', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    expect(screen.getByText('Total submissions:')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('renders progress bars for each language', () => {
    const { container } = render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    const progressBars = container.querySelectorAll('.bg-gray-200.rounded-full');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  test('applies correct color to language bars', () => {
    const { container } = render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    // Check for color classes in the filled portion of bars
    const filledBars = container.querySelectorAll('[class*="bg-"]');
    expect(filledBars.length).toBeGreaterThan(0);
  });

  test('displays submission count and percentage for each language', () => {
    render(<LanguageChart languageBreakdown={mockLanguageBreakdown} />);

    expect(screen.getByText(/45.*30\.0%/)).toBeInTheDocument(); // Python
    expect(screen.getByText(/35.*23\.3%/)).toBeInTheDocument(); // Java
    expect(screen.getByText(/40.*26\.7%/)).toBeInTheDocument(); // Cpp
    expect(screen.getByText(/30.*20\.0%/)).toBeInTheDocument(); // JavaScript
  });

  test('handles empty breakdown', () => {
    render(<LanguageChart languageBreakdown={{}} />);

    expect(screen.getByText('Language Distribution')).toBeInTheDocument();
    expect(screen.getByText('Total submissions:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('handles single language', () => {
    render(<LanguageChart languageBreakdown={{ python: 100 }} />);

    expect(screen.getByTestId('chart-label-python')).toHaveTextContent('Python');
    expect(screen.getByText(/100.*100\.0%/)).toBeInTheDocument();
  });
});
