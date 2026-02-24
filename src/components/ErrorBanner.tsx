'use client';

export interface ErrorBannerProps {
  message: string | null;
}

/** Displays an error alert banner, or nothing if no message is provided. */
export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
    >
      {message}
    </div>
  );
}
