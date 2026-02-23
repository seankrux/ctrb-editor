'use client';

import ErrorDisplay from '@/components/ErrorDisplay';

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <ErrorDisplay
      title="Something went wrong"
      subtitle="An unexpected error occurred while rendering this route."
      digest={error.digest}
      onRetry={reset}
      badgeText="500 Application Error"
    />
  );
}
