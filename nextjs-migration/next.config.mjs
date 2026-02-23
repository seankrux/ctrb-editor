const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;
const BASE_PATH_ENV_KEY = 'NEXTJS_BASE_PATH';

function normalizeBasePath(rawValue) {
  if (!rawValue) {
    return '';
  }

  const trimmed = rawValue.trim();
  if (!trimmed || trimmed === '/') {
    return '';
  }

  // A base path must be a path segment, never an absolute URL.
  if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return '';
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const collapsedSlashes = withLeadingSlash.replace(/\/{2,}/g, '/');
  return collapsedSlashes.endsWith('/') ? collapsedSlashes.slice(0, -1) : collapsedSlashes;
}

function warnConfig(message) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[next.config] ${message}`);
  }
}

const rawBasePath = process.env[BASE_PATH_ENV_KEY] ?? '';
const normalizedBasePath = normalizeBasePath(rawBasePath);
const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "img-src 'self' data: blob: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https: http: ws: wss:",
];

if (process.env.NODE_ENV === 'production') {
  cspDirectives.push('upgrade-insecure-requests');
}

const contentSecurityPolicy = cspDirectives.join('; ');

if (rawBasePath && rawBasePath !== normalizedBasePath) {
  warnConfig(
    `${BASE_PATH_ENV_KEY}="${rawBasePath}" was normalized to "${normalizedBasePath || '/'}".`
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep default Next.js runtime mode (server-capable with static-first rendering).
  // Do not set `output: 'export'` because the app is not a pure static export and
  // needs server rendering semantics for future middleware/API expansions.
  reactStrictMode: true,
  basePath: normalizedBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath,
  },
  // No remote image hosts are required by the current shell.
  // Keep this explicit to prevent accidental third-party image fetches.
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Middleware is intentionally not configured for this app shell.
  // Keep redirects/rewrites explicit and empty unless route behaviors require them.
  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
