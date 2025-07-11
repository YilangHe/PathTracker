import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PWAProvider } from "@/components/PWAProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/config/i18n';

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const messages = await getMessages({ locale });
  
  return {
    title: messages.app?.title || "PATH Train Tracker - Real-time Arrivals for NYC & NJ",
    description: messages.app?.description || "Track real-time PATH train arrivals across New York and New Jersey. Monitor multiple stations, get live updates, and never miss your train. Free PATH tracker for commuters.",
    generator: "Next.js",
    manifest: "/manifest.json",
    keywords: [
      "PATH train tracker",
      "real-time PATH arrivals",
      "NYC PATH train",
      "NJ PATH train",
      "train arrivals",
      "PATH system",
      "New York commuter",
      "New Jersey transit",
      "live train updates",
      "PATH station tracker",
      "NYC subway connection",
      "commuter rail",
      "public transportation",
      "train schedule",
      "Newark PATH",
      "Manhattan PATH",
      "Hoboken PATH",
      "Jersey City PATH",
    ],
    authors: [{ name: "Path Tracker Team" }],
    creator: "Path Tracker Team",
    publisher: "Path Tracker",
    category: "Transportation",
    classification: "Transportation Application",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
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
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "PATH Train Tracker - Real-time arrivals for NYC and NJ",
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : locale === 'es' ? 'es_ES' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: messages.app?.title || "PATH Train Tracker - Real-time Arrivals",
      description: messages.app?.description || "Track real-time PATH train arrivals across NYC and NJ. Never miss your train again.",
      images: ["/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "mask-icon",
          url: "/safari-pinned-tab.svg",
          color: "#2563eb",
        },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "PATH Train Tracker",
      startupImage: [
        {
          url: "/logo.png",
          media:
            "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
        },
      ],
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "PATH Train Tracker",
      "application-name": "PATH Train Tracker",
      "msapplication-TileColor": "#2563eb",
      "msapplication-config": "/browserconfig.xml",
      "theme-color": "#2563eb",
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Path Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Path Tracker" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <script
          defer
          data-domain="livepathtracker.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <UserPreferencesProvider>
              <PWAProvider>
                <OpenPanelComponent
                  clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
                  trackScreenViews={true}
                  trackOutgoingLinks={true}
                  trackAttributes={true}
                />
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
                <Analytics />
              </PWAProvider>
            </UserPreferencesProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}