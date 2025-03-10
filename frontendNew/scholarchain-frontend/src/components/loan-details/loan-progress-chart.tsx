"use client";

import { useEffect, useState } from "react";

interface LoanProgressChartProps {
  completed: number;
  total: number;
  overdue: number;
}

export function LoanProgressChart({
  completed,
  total,
  overdue,
}: LoanProgressChartProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-gray-40 h-40 w-40 rounded-full border-4"></div>
    );
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const completedPercentage = (completed / total) * 100;
  const overduePercentage = (overdue / total) * 100;
  const pendingPercentage = 100 - completedPercentage - overduePercentage;

  const completedOffset =
    circumference - (circumference * completedPercentage) / 100;
  const overdueOffset =
    circumference - (circumference * overduePercentage) / 100;
  const pendingOffset =
    circumference - (circumference * pendingPercentage) / 100;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="-rotate-90 transform"
      >
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth="8"
        />

        {/* Completed segment */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={completedOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Overdue segment */}
        {overdue > 0 && (
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth="8"
            strokeDasharray={`${(circumference * overduePercentage) / 100} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
            transform={`rotate(${completedPercentage * 3.6} 80 80)`}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl font-bold">
          {Math.round(completedPercentage)}%
        </div>
      </div>
    </div>
  );
}
