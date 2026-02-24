'use client';

/**
 * Displays live weather data for the user's current geolocation.
 * Full implementation is handled by the WeatherWidget task.
 */
export default function WeatherWidget() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-[var(--color-foreground)]">
        Local Weather
      </h2>
      <p className="text-sm text-[var(--color-muted)]">Loading…</p>
    </div>
  );
}
