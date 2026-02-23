'use client';

import { useEffect, type ReactNode } from 'react';
import { applyTheme, resolveInitialTheme } from '@/lib/theme';

export default function ClientThemeSync({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    applyTheme(resolveInitialTheme());
  }, []);

  return <>{children}</>;
}
