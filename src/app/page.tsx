import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Baizil</h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Internal student portal for staff to monitor attendance and weather.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
