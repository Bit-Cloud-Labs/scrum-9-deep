'use client';

import { cn } from '@/lib/utils';

export interface ErrorBannerProps {
  /** Error message to display. Pass null or empty string to hide the banner. */
  message: string | null;
  className?: string;
}

/**
 * Displays an accessible error banner when a non-empty message is provided.
 * Renders nothing when message is null or empty.
 */
export default function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800',
        'dark:border-red-700 dark:bg-red-950 dark:text-red-200',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500 dark:text-red-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
