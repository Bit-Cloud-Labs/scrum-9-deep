'use client';

/**
 * Displays real-time student attendance rate with auto-refresh every 30 seconds.
 * Full implementation is handled by the AttendanceRateWidget task.
 */
export default function AttendanceRateWidget() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-[var(--color-foreground)]">
        Attendance Rate
      </h2>
      <p className="text-sm text-[var(--color-muted)]">Loading…</p>
    </div>
  );
}
