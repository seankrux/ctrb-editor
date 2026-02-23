import { runtimeConfig } from '@/lib/runtime-config';

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

function normalizeSiteOrigin(rawValue: string | undefined): string | null {
  if (!rawValue) {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = ABSOLUTE_URL_PATTERN.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export function getSiteOrigin(): string {
  return (
    normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteOrigin(process.env.VERCEL_URL) ??
    'http://localhost:3000'
  );
}

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const { basePath } = runtimeConfig;

  if (!basePath) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `${basePath}/`;
  }

  return `${basePath}${normalizedPath}`;
}
