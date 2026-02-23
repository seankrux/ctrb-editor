type ErrorDisplayProps = {
  title: string;
  subtitle: string;
  digest?: string;
  onRetry: () => void;
  badgeText?: string;
};

export default function ErrorDisplay({
  title,
  subtitle,
  digest,
  onRetry,
  badgeText = 'Application Error',
}: ErrorDisplayProps) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-red-500/40 bg-slate-900/80 p-8">
        <p className="inline-flex w-fit rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-200">
          {badgeText}
        </p>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-300">{subtitle}</p>
        {digest ? (
          <p className="text-xs text-slate-400">
            Reference ID: <code>{digest}</code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-fit items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
