'use client';

import { useEffect, useState, useCallback } from 'react';
import ErrorBanner from './ErrorBanner';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

/** Fetches and displays live weather data based on the user's geolocation. */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeather = useCallback((latitude: number, longitude: number) => {
    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        return response.json() as Promise<WeatherData>;
      })
      .then((data) => {
        setWeather(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load weather data. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadWeather(latitude, longitude);
      },
      () => {
        setError('Location access denied. Please enable location permissions.');
        setIsLoading(false);
      }
    );
  }, [loadWeather]);

  useEffect(() => {
    requestLocation();
    const interval = setInterval(requestLocation, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [requestLocation]);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Local Weather
      </h2>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading weather\u2026</p>
      )}

      {!isLoading && error && <ErrorBanner message={error} />}

      {!isLoading && !error && weather && (
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-bold text-sky-600 dark:text-sky-400">
            {weather.temperature}\u00b0C
          </span>
          <span className="text-xl text-gray-600 dark:text-gray-300">{weather.condition}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{weather.location}</span>
        </div>
      )}
    </div>
  );
}
