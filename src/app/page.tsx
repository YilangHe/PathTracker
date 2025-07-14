import type { Metadata } from "next";
import PathTrackerClient from './[locale]/page-client';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PWAProvider } from "@/components/PWAProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'en';
  const messages = await getMessages({ locale });
  
  return {
    title: messages.app?.title || "PATH Train Tracker - Real-time Arrivals for NYC & NJ",
    description: messages.app?.description || "Track real-time PATH train arrivals across New York and New Jersey. Monitor multiple stations, get live updates, and never miss your train. Free PATH tracker for commuters.",
    metadataBase: new URL("https://www.livepathtracker.com"),
    alternates: {
      canonical: "/",
      languages: {
        'en': '/en',
        'zh': '/zh',
        'es': '/es',
      },
    },
    openGraph: {
      title: messages.app?.title || "PATH Train Tracker - Real-time Arrivals for NYC & NJ",
      description: messages.app?.description || "Track real-time PATH train arrivals across New York and New Jersey. Monitor multiple stations, get live updates, and never miss your train.",
      url: "https://www.livepathtracker.com",
      siteName: "PATH Train Tracker",
      locale: 'en_US',
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// This is the root page that serves content without redirects
// It provides the same experience as the localized pages but at the root URL
export default async function RootPage() {
  // Default to English locale for root page
  const locale = 'en';
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <UserPreferencesProvider>
          <PWAProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebApplication",
                  name: "PATH Train Tracker",
                  alternateName: "Path Tracker",
                  description:
                    "Track real-time PATH train arrivals across New York and New Jersey. Monitor multiple stations, get live updates, and never miss your train. Free PATH tracker for commuters.",
                  url: "https://www.livepathtracker.com",
                  applicationCategory: "TransportationApplication",
                  operatingSystem: "Web, iOS, Android",
                  browserRequirements: "Modern web browser with JavaScript enabled",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                  },
                  author: {
                    "@type": "Organization",
                    name: "Path Tracker Team",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Path Tracker Team",
                  },
                  keywords:
                    "PATH train tracker, real-time arrivals, NYC transit, New Jersey transit, train tracker, PATH system, commuter rail, public transportation",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    reviewCount: "250",
                    bestRating: "5",
                    worstRating: "1",
                  },
                  featureList: [
                    "Real-time train arrivals",
                    "Multiple station tracking",
                    "Live updates every 30 seconds",
                    "Location-based closest station",
                    "Mobile-friendly design",
                    "Dark mode support",
                    "Offline capability",
                    "Push notifications",
                  ],
                  screenshot: "https://www.livepathtracker.com/logo.png",
                  softwareVersion: "1.0.0",
                  releaseNotes: "Initial release with full PATH system support",
                  applicationSubCategory: "Public Transit",
                  countriesSupported: "US",
                  serviceArea: {
                    "@type": "GeoCircle",
                    geoMidpoint: {
                      "@type": "GeoCoordinates",
                      latitude: "40.7128",
                      longitude: "-74.0060",
                    },
                    geoRadius: "50000",
                  },
                  about: {
                    "@type": "Thing",
                    name: "PATH Train System",
                    description:
                      "Port Authority Trans-Hudson rapid transit system connecting New York and New Jersey",
                  },
                  breadcrumb: {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      {
                        "@type": "ListItem",
                        position: 1,
                        name: "PATH Train Tracker",
                        item: "https://www.livepathtracker.com",
                      },
                    ],
                  },
                }),
              }}
            />
            <OpenPanelComponent
              clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
              trackScreenViews={true}
              trackOutgoingLinks={true}
              trackAttributes={true}
            />
            <Navbar />
            <main className="flex-grow">
              <PathTrackerClient />
            </main>
            <Footer />
            <Analytics />
          </PWAProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}