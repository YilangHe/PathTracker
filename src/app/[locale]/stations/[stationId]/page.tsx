import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { STATIONS } from '@/constants/stations';
import { STATION_DETAILS } from '@/data/station-details';
import StationPageClient from './page-client';

interface PageProps {
  params: Promise<{
    locale: string;
    stationId: string;
  }>;
}

export async function generateStaticParams() {
  const stationIds = Object.keys(STATIONS);
  const locales = ['en', 'es', 'zh'];
  
  return locales.flatMap(locale =>
    stationIds.map(stationId => ({
      locale,
      stationId,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stationId } = await params;
  const stationDetails = STATION_DETAILS[stationId];
  
  if (!stationDetails) {
    return {
      title: 'Station Not Found',
    };
  }

  const stationName = STATIONS[stationId as keyof typeof STATIONS];
  
  return {
    title: `${stationName} PATH Station - Real-time Arrivals & Station Info`,
    description: `Live PATH train arrivals at ${stationName} station. ${stationDetails.description} View schedules, nearby attractions, parking info, and transportation connections.`,
    keywords: `${stationName} PATH station, ${stationName} train schedule, PATH train ${stationName}, ${stationName} arrivals, ${stationDetails.address}`,
    openGraph: {
      title: `${stationName} PATH Station`,
      description: `Real-time PATH train arrivals and station information for ${stationName}`,
      type: 'website',
    },
    alternates: {
      canonical: `/stations/${stationId}`,
      languages: {
        'en': `/en/stations/${stationId}`,
        'es': `/es/stations/${stationId}`,
        'zh': `/zh/stations/${stationId}`,
      }
    }
  };
}

export default async function StationPage({ params }: PageProps) {
  const { locale, stationId } = await params;
  const t = await getTranslations();
  
  if (!STATIONS[stationId as keyof typeof STATIONS] || !STATION_DETAILS[stationId]) {
    notFound();
  }

  return (
    <StationPageClient
      stationId={stationId}
      stationDetails={STATION_DETAILS[stationId]}
      locale={locale}
    />
  );
}