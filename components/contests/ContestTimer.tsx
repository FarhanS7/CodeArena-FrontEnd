'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
  endTime: Date;
  onTimeUp?: () => void;
}

export function ContestTimer({ endTime, onTimeUp }: ContestTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    // Calculate initial remaining time
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      setRemainingSeconds(diff);

      if (diff === 0 && onTimeUp) {
        onTimeUp();
      }
    };

    updateTimer(); // Set initial value

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isWarning = remainingSeconds < 300; // 5 minutes

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      data-testid="timer-container"
      className={`flex items-center gap-3 ${isWarning ? 'text-red-500' : 'text-blue-400'}`}
    >
      <Clock className={`w-4 h-4 ${isWarning ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-bold tracking-widest">
          TIME REMAINING
        </span>
        <span
          data-testid="timer"
          className="text-xl font-black tabular-nums tracking-tighter italic font-mono"
        >
          {timeString}
        </span>
      </div>
    </div>
  );
}
