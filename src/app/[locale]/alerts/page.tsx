import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AlertsPageClient } from "./page-client";

// Use static generation for faster initial page load
// Data will be fetched client-side
export const dynamic = 'force-static';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "alerts" });

  const title = "PATH Alerts - Real-time Service Alerts & Delays | PATH Train Tracker";
  const description = "Get real-time PATH alerts, service disruptions, and train delays. Stay informed about PATH system status, track changes, weekend service, and emergency notifications for all PATH stations.";

  return {
    title,
    description,
    keywords: [
      "PATH alerts",
      "PATH alert",
      "PATH service alerts",
      "PATH train delays",
      "PATH disruptions",
      "PATH service status",
      "PATH emergency alerts",
      "PATH weekend service",
      "PATH train updates",
      "PATH system status",
      "PATH service advisories",
      "PATH train notifications",
      "PATH transit alerts",
      "New York PATH alerts",
      "New Jersey PATH alerts",
      "NYC train delays",
      "NJ transit alerts",
      "real-time PATH updates",
      "PATH service changes",
      "PATH track work"
    ],
    openGraph: {
      title: "PATH Alerts - Real-time Service Alerts & Delays",
      description,
      url: `https://www.livepathtracker.com/${locale}/alerts`,
      siteName: "PATH Train Tracker",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "PATH Alerts - Real-time service alerts and delays",
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : locale === 'es' ? 'es_ES' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "PATH Alerts - Real-time Service Updates",
      description: "Get instant PATH alerts and service disruptions. Stay informed about delays and track changes.",
      images: ["/logo.png"],
    },
    alternates: {
      canonical: "/alerts",
      languages: {
        'en': '/en/alerts',
        'es': '/es/alerts',
        'zh': '/zh/alerts',
      }
    },
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

function generateAlertStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PATH Alerts - Real-time Service Alerts",
    description: "Real-time PATH train service alerts, delays, and disruptions",
    url: "https://www.livepathtracker.com/alerts",
    isPartOf: {
      "@type": "WebSite",
      name: "PATH Train Tracker",
      url: "https://www.livepathtracker.com"
    },
    about: {
      "@type": "TransitAgency",
      name: "PATH (Port Authority Trans-Hudson)",
      url: "https://www.panynj.gov/path/",
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: "40.7128",
          longitude: "-74.0060"
        },
        geoRadius: "50000"
      }
    },
    mainEntity: {
      "@type": "Service",
      name: "PATH Alerts Service",
      serviceType: "Transit Information",
      provider: {
        "@type": "Organization",
        name: "PATH Train Tracker"
      },
      serviceOutput: {
        "@type": "DataFeed",
        name: "Real-time PATH Alerts",
        encodingFormat: "application/json",
        dataFeedElement: {
          "@type": "ServiceAnnouncement",
          datePosted: new Date().toISOString(),
          expires: new Date(Date.now() + 86400000).toISOString(),
          category: "https://schema.org/ServiceDisruption"
        }
      }
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "PATH Train Tracker",
          item: "https://www.livepathtracker.com"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "PATH Alerts",
          item: "https://www.livepathtracker.com/alerts"
        }
      ]
    },
    potentialAction: {
      "@type": "ViewAction",
      name: "View PATH Alerts",
      target: "https://www.livepathtracker.com/alerts"
    }
  };
}

export default async function AlertsPage({ params: { locale } }: Props) {
  // Don't fetch data on server - let client handle it for faster page load
  // This way the page loads immediately and shows skeleton/cached data
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateAlertStructuredData()),
        }}
      />
      <AlertsPageClient />
    </>
  );
}