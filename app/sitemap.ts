import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

/** Javne stranice za indeksiranje (bez korpe, zahvalnice, prijava, panela). */
const PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/o-nama', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/ritual', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/proizvodi/uljani-serum', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/proizvodi/vodeni-serum', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/porudzbina', changeFrequency: 'monthly', priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
