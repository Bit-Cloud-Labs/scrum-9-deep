'use client';

/**
 * AttendanceRateWidget displays the current student attendance rate,
 * auto-refreshes every 30 seconds, and shows a user-friendly error on failure.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AttendanceData {
  rate: number;
}

const REFRESH_INTERVAL_MS = 30_000;
const API_ENDPOINT = '/api/attendance';
const ERROR_MESSAGE = 'Failed to load attendance data. Please try again later.';

export default function AttendanceRateWidget() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data: AttendanceData = await response.json();
      setRate(data.rate);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();

    const intervalId = setInterval(fetchAttendance, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchAttendance]);

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 shadow-sm',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
      )}
      aria-live="polite"
      aria-label="Attendance Rate Widget"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Attendance Rate
      </h2>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {!isLoading && hasError && (
        <p className="text-red-600 dark:text-red-400">{ERROR_MESSAGE}</p>
      )}

      {!isLoading && !hasError && rate !== null && (
        <div className="flex items-end gap-1">
          <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            {rate.toFixed(1)}
          </span>
          <span className="mb-1 text-2xl font-medium text-gray-500 dark:text-gray-400">
            %
          </span>
        </div>
      )}

      {!isLoading && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Auto-refreshes every 30 seconds
        </p>
      )}
    </div>
  );
}
