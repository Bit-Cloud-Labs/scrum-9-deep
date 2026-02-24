import AttendanceRateWidget from '@/components/AttendanceRateWidget';
import WeatherWidget from '@/components/WeatherWidget';

/** Dashboard page showing the Baizil Staff Portal with attendance and weather widgets. */
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Baizil</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Staff Portal</p>
        </header>

        {/* Widget grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AttendanceRateWidget />
          <WeatherWidget />
        </div>
      </div>
    </main>
  );
}
