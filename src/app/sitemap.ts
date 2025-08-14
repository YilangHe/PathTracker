import { MetadataRoute } from "next";
import { locales } from '@/config/i18n';
import { STATIONS } from '@/constants/stations';

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
      path: '/alerts',
      changeFrequency: 'always' as const,
      priority: 0.95,
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
    {
      path: '/service-maps',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Add station pages with higher priority for major stations
  const majorStations = ['WTC', '33S', 'HOB', 'NWK', 'JSQ'];
  const stationRoutes = Object.keys(STATIONS).map(stationId => ({
    path: `/stations/${stationId}`,
    changeFrequency: 'daily' as const,
    priority: majorStations.includes(stationId) ? 0.9 : 0.8,
  }));

  // Combine all routes
  const allRoutes = [...routes, ...stationRoutes];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add root URL (no locale prefix)
  allRoutes.forEach(route => {
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.path === '' ? route.priority : route.priority,
    });
  });

  // Add localized URLs
  locales.forEach(locale => {
    allRoutes.forEach(route => {
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
