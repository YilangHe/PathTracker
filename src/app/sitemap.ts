import { MetadataRoute } from "next";
import { locales } from '@/config/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.livepathtracker.com";
  const lastModified = new Date();

  const routes = [
    {
      path: '',
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      path: '/disclaimer',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      path: '/add-to-home-screen',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add root URL (no locale prefix)
  routes.forEach(route => {
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.path === '' ? route.priority : route.priority,
    });
  });

  // Add localized URLs
  locales.forEach(locale => {
    routes.forEach(route => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.path === '' ? 0.9 : route.priority * 0.8, // Slightly lower priority for localized versions
      });
    });
  });

  return sitemap;
}
