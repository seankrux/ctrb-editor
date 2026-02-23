import type { MetadataRoute } from 'next';
import { getSiteOrigin, withBasePath } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: withBasePath('/'),
        disallow: [withBasePath('/api/')],
      },
    ],
    sitemap: `${origin}${withBasePath('/sitemap.xml')}`,
  };
}
