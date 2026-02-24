'use client';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Real-time attendance and weather information.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* AttendanceRateWidget placeholder — implemented by parallel task */}
          <div
            data-testid="attendance-widget-placeholder"
            className="rounded-lg border border-[var(--color-border)] p-6"
          >
            <h2 className="text-lg font-semibold">Attendance Rate</h2>
            <p className="mt-2 text-[var(--color-muted)] text-sm">Loading…</p>
          </div>

          {/* WeatherWidget placeholder — implemented by parallel task */}
          <div
            data-testid="weather-widget-placeholder"
            className="rounded-lg border border-[var(--color-border)] p-6"
          >
            <h2 className="text-lg font-semibold">Weather</h2>
            <p className="mt-2 text-[var(--color-muted)] text-sm">Loading…</p>
          </div>
        </div>
      </div>
    </main>
  );
}
