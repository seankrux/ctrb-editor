import ThemeToggle from '@/components/ThemeToggle';
import { runtimeConfig } from '@/lib/runtime-config';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-2xl border border-primary-500/30 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-200">
              Next.js Deployment Ready
            </p>
            <h1 className="text-3xl font-bold">CTRBooster Nebula</h1>
            <p className="mt-2 text-sm text-slate-300">
              Production-safe shell route is live and ready for incremental feature migration.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-sm text-slate-300">
          Legacy demo visuals were removed to keep the deployment footprint small and
          deterministic.
        </p>
        <p className="text-xs text-slate-400">
          API base URL: <code>{runtimeConfig.apiBaseUrl}</code>
        </p>

        <a
          href="https://github.com/seankrux/CTRB-editor"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
        >
          Open GitHub Repo
        </a>
      </section>
    </main>
  );
}
