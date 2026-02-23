'use client';

import { useEffect, useState } from 'react';
import { applyTheme, resolveInitialTheme, type ThemeMode } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const nextTheme = resolveInitialTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const isDark = theme === 'dark';

  function toggleTheme() {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  const baseClasses =
    'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';
  const variantClasses = isDark
    ? 'border-primary-400/40 bg-primary-500/15 text-primary-100 hover:bg-primary-500/25'
    : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={!isDark}
      className={`${baseClasses} ${variantClasses}`}
    >
      <span aria-hidden>{isDark ? 'DM' : 'LM'}</span>
      <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
    </button>
  );
}
