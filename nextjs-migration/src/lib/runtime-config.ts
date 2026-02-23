const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

function trimTrailingSlash(value: string): string {
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
}

function normalizeBasePath(rawValue: string | undefined): string {
  if (!rawValue) {
    return '';
  }

  const trimmed = rawValue.trim();
  if (!trimmed || trimmed === '/') {
    return '';
  }

  const withLeadingSlash: string = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const collapsedSlashes: string = withLeadingSlash.replace(/\/{2,}/g, '/');
  return trimTrailingSlash(collapsedSlashes);
}

function normalizePathValue(rawValue: string): string {
  const withLeadingSlash: string = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
  const collapsedSlashes: string = withLeadingSlash.replace(/\/{2,}/g, '/');
  return trimTrailingSlash(collapsedSlashes);
}

function normalizeApiBaseUrl(rawValue: string | undefined, basePath: string): string {
  const fallback = basePath ? `${basePath}/api` : '/api';

  if (!rawValue) {
    return fallback;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return fallback;
  }

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return trimTrailingSlash(trimmed);
  }

  const normalizedPath = normalizePathValue(trimmed);
  if (!basePath) {
    return normalizedPath;
  }

  if (normalizedPath === basePath) {
    return fallback;
  }

  if (normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL, basePath);

export const runtimeConfig = Object.freeze({
  basePath,
  apiBaseUrl,
});

