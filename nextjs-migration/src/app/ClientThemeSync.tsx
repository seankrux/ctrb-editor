'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store';

export default function ClientThemeSync({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return <>{children}</>;
}
