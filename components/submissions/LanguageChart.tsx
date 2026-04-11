'use client';

interface LanguageChartProps {
  languageBreakdown: { [language: string]: number };
}

/**
 * LanguageChart Component - Show language distribution
 */
export function LanguageChart({ languageBreakdown }: LanguageChartProps) {
  const total = Object.values(languageBreakdown).reduce((a, b) => a + b, 0);
  const colors: { [key: string]: string } = {
    python: 'bg-blue-500',
    cpp: 'bg-red-500',
    java: 'bg-orange-500',
    javascript: 'bg-yellow-500',
    'c#': 'bg-purple-500',
    go: 'bg-teal-500',
    rust: 'bg-orange-600',
    ruby: 'bg-red-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Language Distribution</h3>

      <div data-testid="language-distribution-chart" className="space-y-4">
        {Object.entries(languageBreakdown)
          .sort(([, a], [, b]) => b - a)
          .map(([language, count]) => {
            const percentage = (count / total) * 100;
            const bgColor = colors[language.toLowerCase()] || 'bg-gray-500';

            return (
              <div key={language} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span data-testid={`chart-label-${language.toLowerCase()}`} className="text-sm font-medium text-gray-900">
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${bgColor} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total submissions: <span className="font-semibold text-gray-900">{total}</span>
        </p>
      </div>
    </div>
  );
}
