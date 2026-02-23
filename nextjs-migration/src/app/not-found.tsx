import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-8">
        <p className="inline-flex w-fit rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200">
          404 Not Found
        </p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-slate-300">
          The requested route does not exist in this deployment.
        </p>
        <Link
          href="/"
          className="inline-flex w-fit items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
