'use client';

import ErrorDisplay from '@/components/ErrorDisplay';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <ErrorDisplay
          title="A critical error occurred"
          subtitle="The application failed before the normal route shell could load."
          digest={error.digest}
          onRetry={reset}
          badgeText="Global Rendering Error"
        />
      </body>
    </html>
  );
}
