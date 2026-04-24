import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
  endTime: Date;
  onTimeUp?: () => void;
}

/**
 * Contest Timer - Countdown display
 * Shows remaining time in HH:MM:SS format
 * Warns when < 5 minutes remain
 */
export function ContestTimer({ endTime, onTimeUp }: ContestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const diff = Math.max(0, end - now);

      if (diff === 0) {
        setTimeRemaining('00:00:00');
        setIsExpired(true);
        if (onTimeUp) {
          onTimeUp();
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setTimeRemaining(formatted);

      // Warn if less than 5 minutes (300000ms)
      setIsWarning(diff < 300000);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  return (
    <div
      data-testid="timer-container"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
        isExpired ? 'bg-gray-100 border-gray-300' : 'bg-white border-blue-300'
      } ${isWarning ? 'text-red-500 bg-red-50 border-red-300' : 'text-blue-600'}`}
    >
      <Clock className="w-5 h-5" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-600">TIME REMAINING</span>
        <span data-testid="timer" className="text-xl font-bold tabular-nums">
          {timeRemaining}
        </span>
      </div>
      {isWarning && <span className="ml-2 text-sm font-semibold">⏰ Hurry!</span>}
    </div>
  );
}
