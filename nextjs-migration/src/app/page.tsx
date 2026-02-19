import NebulaBackground from '@/components/NebulaBackground';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background-light p-6 text-slate-100">
      <NebulaBackground />
      <section className="relative mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-primary-500/30 bg-surface/80 p-8 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-200">
              Next.js Deployment Ready
            </p>
            <h1 className="text-3xl font-bold">CTRBooster Nebula</h1>
            <p className="mt-2 text-sm text-slate-300">
              Clean, production-focused entrypoint is now mounted and ready for use.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-sm text-slate-300">
          You can start migrating campaign workflows from this page and wire tools/API
          integration into this shell.
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
