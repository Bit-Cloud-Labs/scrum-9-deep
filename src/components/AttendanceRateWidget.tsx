'use client';

import { useEffect, useState, useCallback } from 'react';
import ErrorBanner from './ErrorBanner';

interface AttendanceData {
  rate: number;
}

const REFRESH_INTERVAL_MS = 30_000;
const API_URL = '/api/attendance';
const ERROR_MESSAGE = 'Failed to load attendance data. Please try again.';

/** Fetches and displays real-time attendance rate with auto-refresh every 30 seconds. */
export default function AttendanceRateWidget() {
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAttendance = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Response not ok');
      }
      const data: AttendanceData = await response.json();
      setRate(data.rate);
      setError(null);
    } catch {
      setError(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
    const interval = setInterval(loadAttendance, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadAttendance]);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Attendance Rate
      </h2>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading attendance…</p>
      )}

      {!isLoading && error && <ErrorBanner message={error} />}

      {!isLoading && !error && rate !== null && (
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            {rate}%
          </span>
          <span className="mb-1 text-sm text-gray-500 dark:text-gray-400">current</span>
        </div>
      )}
    </div>
  );
}
