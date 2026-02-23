import type { MetadataRoute } from 'next';
import { getSiteOrigin, withBasePath } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const now = new Date();

  return [
    {
      url: `${origin}${withBasePath('/')}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
