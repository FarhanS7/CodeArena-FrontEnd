"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function ContestCountdown({ targetDate, onComplete }: { targetDate: string, onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
        onComplete?.();
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HRS", value: timeLeft.hours },
        { label: "MINS", value: timeLeft.minutes },
        { label: "SECS", value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center group">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md group-hover:border-blue-500/50 transition-colors">
            <span className="text-2xl md:text-3xl font-black text-white">{item.value.toString().padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
