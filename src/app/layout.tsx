import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Baizil',
  description: 'Internal student portal for staff — real-time attendance metrics and weather data.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
