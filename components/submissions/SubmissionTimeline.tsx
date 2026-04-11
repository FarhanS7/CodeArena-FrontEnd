'use client';

interface TimelineEntry {
  date: string;
  submissions: number;
  accepted: number;
}

interface SubmissionTimelineProps {
  timeline: TimelineEntry[];
}

/**
 * SubmissionTimeline Component - Show submission activity over time
 */
export function SubmissionTimeline({ timeline }: SubmissionTimelineProps) {
  const maxSubmissions = Math.max(...timeline.map((t) => t.submissions), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline (Last 7 Days)</h3>

      <div data-testid="submission-timeline" className="flex items-end gap-2 h-40">
        {timeline.map((entry) => {
          const heightPercent = (entry.submissions / maxSubmissions) * 100;
          const acceptedPercent = (entry.accepted / entry.submissions) * 100;

          return (
            <div
              key={entry.date}
              className="flex-1 flex flex-col items-center gap-2"
            >
              {/* Bar */}
              <div className="w-full flex flex-col items-center justify-end h-32 gap-1">
                <div
                  data-testid="timeline-day-bar"
                  className="w-full bg-gray-200 rounded-t transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Accepted portion */}
                  <div
                    className="bg-green-500 w-full transition-all duration-300"
                    style={{ height: `${acceptedPercent}%` }}
                  />
                </div>
              </div>

              {/* Date label */}
              <span className="text-xs text-gray-600 text-center whitespace-nowrap">
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>

              {/* Count */}
              <span className="text-xs font-medium text-gray-900 text-center">
                {entry.submissions}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-600">Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <span className="text-gray-600">Rejected</span>
        </div>
      </div>
    </div>
  );
}
