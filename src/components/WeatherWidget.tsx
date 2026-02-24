'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

type WidgetState =
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; message: string };

const REFRESH_INTERVAL_MS = 30_000;
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? 'demo';

/** Fetches current weather data for the given coordinates. */
async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `${WEATHER_API_BASE}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json() as Promise<WeatherData>;
}

/** Retrieves the user's current geolocation coordinates. */
function getCoordinates(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
    );
  });
}

/** Capitalises the first character of a string. */
function capitalise(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Checks whether an error message indicates a geolocation-related failure. */
function isGeolocationError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('permission') ||
    lower.includes('denied') ||
    lower.includes('not supported') ||
    lower.includes('unavailable') ||
    lower.includes('geolocation') ||
    lower.includes('location')
  );
}

/** Checks whether an error message indicates the browser has no geolocation API. */
function isUnsupportedError(message: string): boolean {
  return message.toLowerCase().includes('not supported');
}

/** WeatherWidget — shows real-time weather based on the user's geolocation. */
export default function WeatherWidget() {
  const [state, setState] = useState<WidgetState>({ status: 'loading' });

  const loadWeather = useCallback(async () => {
    try {
      const coords = await getCoordinates();
      const data = await fetchWeather(coords.latitude, coords.longitude);
      setState({ status: 'success', data });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Unknown error';

      if (isGeolocationError(raw)) {
        setState({
          status: 'error',
          message: isUnsupportedError(raw)
            ? 'Geolocation is not supported by this browser.'
            : 'Unable to determine your location. Please allow location access.',
        });
      } else {
        setState({
          status: 'error',
          message: 'Failed to load weather data. Please try again later.',
        });
      }
    }
  }, []);

  useEffect(() => {
    void loadWeather();
    const intervalId = setInterval(() => {
      void loadWeather();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [loadWeather]);

  return (
    <section
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 p-6',
        'backdrop-blur-sm shadow-lg',
      )}
      aria-label="Weather Widget"
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
        Weather
      </h2>

      {state.status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Loading weather…
        </div>
      )}

      {state.status === 'error' && (
        <div
          role="alert"
          className={cn(
            'rounded-lg border border-red-500/30 bg-red-500/10',
            'px-4 py-3 text-sm text-red-300',
          )}
        >
          {state.message}
        </div>
      )}

      {state.status === 'success' && (
        <div className="space-y-3">
          {/* City */}
          <p className="text-2xl font-bold text-white">{state.data.name}</p>

          {/* Temperature */}
          <p className="text-4xl font-extrabold text-white">
            {Math.round(state.data.main.temp)}
            <span className="ml-1 text-xl font-medium text-white/60">°C</span>
          </p>

          {/* Description */}
          <p className="text-sm capitalize text-white/80">
            {capitalise(state.data.weather[0]?.description ?? '')}
          </p>

          {/* Details row */}
          <div className="mt-4 flex gap-6 text-sm text-white/60">
            <span>
              Humidity:{' '}
              <strong className="text-white">{state.data.main.humidity}%</strong>
            </span>
            <span>
              Wind:{' '}
              <strong className="text-white">
                {state.data.wind.speed} m/s
              </strong>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
