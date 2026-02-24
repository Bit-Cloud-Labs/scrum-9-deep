import AttendanceRateWidget from '@/components/AttendanceRateWidget';
import ErrorBanner from '@/components/ErrorBanner';
import WeatherWidget from '@/components/WeatherWidget';

/**
 * Dashboard page — staff view of real-time attendance and weather data.
 */
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-8 lg:px-16">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl">
          Baizil Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Real-time attendance metrics and local weather
        </p>
      </header>

      {/* Error banner — rendered here so it spans the full content area */}
      <ErrorBanner message={null} />

      {/* Widgets grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <AttendanceRateWidget />
        <WeatherWidget />
      </div>
    </main>
  );
}
