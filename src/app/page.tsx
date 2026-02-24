import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Baizil
        </h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Student portal \u2014 attendance tracking, weather updates, and more.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm hover:opacity-90 transition-opacity"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
