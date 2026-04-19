import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://srrresorts.com';

  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/privacy',
    '/terms',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
